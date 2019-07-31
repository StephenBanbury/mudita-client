import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { LocationService } from '../services/location.service'
import { EventModel } from '../shared/event-object.model'
import { FenceModel } from '../shared/fence-object-model';
import { LocationModel } from '../shared/location-object.model'
import { MuditaApiService } from '../services/mudita-api.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { GeoMarkerIconModel } from 'src/app/shared/geo-marker-icon-object.model';
import { PreferencesModel } from '../shared/preferences-object.model';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: "app-explore",
  templateUrl: "explore.page.html",
  styleUrls: ["explore.page.scss"]
})
export class ExplorePage implements OnInit {
  myEvent: EventModel;

  // I'm using this to inform me what is happening on mobile device as a substitute for console.log
  //appEventNotifications: Array<string> = [];

  myFences: Array<FenceModel> = [];
  myLocalFence: FenceModel;
  title: string = "Mudita Events";
  height = 0;
  myLocation: LocationModel;

  myGeoMarkerLabel: any;
  myGeoMarkerIcon: GeoMarkerIconModel;
  myGeoMarkerIconRegular: GeoMarkerIconModel;
  myGeoMarkerIconHighlighted: GeoMarkerIconModel;

  //geoMarkerLabel: any;
  geoMarkerIconRegular: GeoMarkerIconModel;
  geoMarkerIconHighlighted: GeoMarkerIconModel;

  eventId: number;
  closeMetres: number;
  reallyCloseMetres: number;

  statusMessage: string;
  zoom: number;
  mapType: string;
  canSelectFence: boolean;
  fenceIsClose: boolean;
  fenceIsReallyClose: boolean;

  locationObservable: Observable<LocationModel>;
  trackingMyLocation: boolean;

  subscribeToHeading: Subscription;
  subscribeToEventFences: Subscription;
  subscribeToLocation: Subscription;

  myHeading: number;
  myBearing: number;
  myBearingTwo: number;
  relativeBearing: number;

  audioContext: AudioContext;
  audioElement: HTMLAudioElement;
  audioSourceNode: MediaElementAudioSourceNode;
  audioPannerNode: StereoPannerNode;
  audioInterval: number;
  playLoop: any;
  isPlayingLoop: boolean;
  currentAudioPanning: number;

  preferences: PreferencesModel = new PreferencesModel();

  constructor(
    public platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private muditaApiServce: MuditaApiService,
    private tts: TextToSpeech
  ) {
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.myEvent = this.router.getCurrentNavigation().extras.state.event;     
        this.preferences = this.router.getCurrentNavigation().extras.state.preferences;
        this.getEventFences(this.myEvent.id); 
      }
    });

    this.height = platform.height() - 56;
    this.myLocalFence = new FenceModel();
    this.myLocalFence.distance = 99999999;
    this.myLocation = new LocationModel();
    this.closeMetres = 15;
    this.reallyCloseMetres = 10;
    this.zoom = 18;
    this.mapType = "roadmap";

    this.myGeoMarkerLabel = {
      color: "#000",
      fontFamily: "",
      fontSize: "16px",
      fontWeight: "bold",
      text: "ME"
    };

    this.myGeoMarkerIconRegular = {
      url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      scaledSize: {
        width: 40,
        height: 40
      }
    };

    this.myGeoMarkerIconHighlighted = {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      scaledSize: {
        width: 40,
        height: 40
      }
    };

    this.geoMarkerIconRegular = {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      scaledSize: {
        width: 40,
        height: 40
      }
    };

    this.geoMarkerIconHighlighted = {
      url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
      scaledSize: {
        width: 40,
        height: 40
      }
    };

    this.myGeoMarkerIcon = this.myGeoMarkerIconRegular;
    this.isPlayingLoop = false;
  }

  ngOnInit() {
    this.trackingMyLocation = false;
  }

  ionViewWillLeave() {
    //console.log('ionViewWillLeave');
    this.unsubscribeEventFences();
    this.unsubscribeHeading();
    this.unsubscribeLocation();
    clearTimeout(this.playLoop);
    this.isPlayingLoop = false;
  }

  ngOnDestroy() {
    //console.log('ngOnDestroy');
    this.unsubscribeEventFences();
    this.unsubscribeHeading();
    this.unsubscribeLocation();
    clearTimeout(this.playLoop);
    this.isPlayingLoop = false;
  }

  audioInit() {
    this.audioContext = new AudioContext();
    this.audioElement = new Audio('../../assets/sounds/beep1_mono.mp3');
    this.audioPannerNode = this.audioContext.createStereoPanner()
    this.audioSourceNode = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSourceNode.connect(this.audioPannerNode)
    this.audioPannerNode.connect(this.audioContext.destination)
  }

  loopAudio() {
    let that = this;
    this.isPlayingLoop = true;
    this.playLoop = setTimeout(function () {
      that.audioElement.play();
      that.loopAudio();      
    }, this.audioInterval);
  }

  panAudio() {
    if(this.relativeBearing >= 350 || this.relativeBearing <= 10) {
      this.audioPannerNode.pan.value = 0
      if(this.currentAudioPanning != 0){
        this.speech('Geo-fence ahead');
        this.currentAudioPanning = 0;
      }
    }

    if(this.relativeBearing < 350 && this.relativeBearing >= 180) {
      this.audioPannerNode.pan.value = 1
      if(this.currentAudioPanning != 1){
        this.speech('Geo-fence to your right');
        this.currentAudioPanning = 1;
      }
    }

    if(this.relativeBearing > 10 && this.relativeBearing < 180) {
      this.audioPannerNode.pan.value = -1;
      if(this.currentAudioPanning != -1){
        this.speech('Geo-fence to your left');
        this.currentAudioPanning = -1;
      }
    }
  }

  speech(text: string) {
    
    this.tts.speak(text)
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
  }

  getEventFences(eventId: number) {
    this.myEvent = new EventModel();
    this.myFences = new Array<FenceModel>();

    this.subscribeToEventFences = this.muditaApiServce.getEventFences(eventId)
      .subscribe(eventFences => {
        this.myEvent.id = eventFences.event.id;
        this.myEvent.title = eventFences.event.title;
        this.myEvent.description = eventFences.event.description;
        eventFences.fences.forEach(fence => {
          const markerLabel = {
            color: "#000",
            fontFamily: "",
            fontSize: "16px",
            fontWeight: "bold",
            text: fence.tag
          };
          this.myFences.push({
            id: fence.id,
            tag: fence.tag,
            location: {
              accuracy: 0,
              latitude: fence.latitude,
              longitude: fence.longitude
            },
            distance: 0,
            selected: false,
            show: true,
            geoMarkerLabel: markerLabel,
            geoMarkerIcon: this.geoMarkerIconRegular,
            text: "",
            textColour: "",
            bgColour: ""
          })
        })

        if (!this.myLocation) {
          this.myLocation = new LocationModel();
        }

        this.trackMyLocation();
        this.trackMyHeading();
      });
  }

  nextFenceId() {
    return this.myFences.length + 9999;
  }

  onCreateNewFence(event) {
    if (!this.myEvent) {
      return;
    }
    const newFence = new FenceModel();
    const newFenceLocation = new LocationModel();

    newFence.id = this.nextFenceId();

    newFenceLocation.latitude = event.coords.lat;
    newFenceLocation.longitude = event.coords.lng;

    newFence.location = newFenceLocation;
    newFence.tag = "New fence " + (this.myFences.length + 1).toString();
    newFence.show = true;
    newFence.geoMarkerLabel = {
      color: "#000",
      fontFamily: "",
      fontSize: "16px",
      fontWeight: "bold",
      text: newFence.tag
    };
    this.myFences.push(newFence);
  }

  onSelectFence() {        
    let navigationExtras: NavigationExtras = {
      state: {
        eventId: this.myEvent.id,
        fenceId: this.myLocalFence.id
      }
    };    
    this.router.navigate(['/tabs/fence'], navigationExtras);
  }

  visualBearing(){
    this.preferences.visualBearing = !this.preferences.visualBearing;
  }
  showMap(){
    this.preferences.map = !this.preferences.map;
  }
  showDirection(){
    this.preferences.direction = !this.preferences.direction;
  }
  audioBearing(){
    this.preferences.audioBearing = !this.preferences.audioBearing;
    if(!this.preferences.audioBearing){
      clearTimeout(this.playLoop);
      this.isPlayingLoop = false;
    }else{
      this.loopAudio()
    }
  }

  private checkForLocalEventFences() {
    //console.log('checkForLocalEventFences');

    if (this.myFences.length == 0) {
      this.statusMessage = "This event has no fences!";
      return false;
    }

    this.myFences.forEach(fence => {
      fence.distance = Math.round(
        this.locationService.getDistanceFromLatLonInKm(
          this.myLocation.latitude,
          this.myLocation.longitude,
          fence.location.latitude,
          fence.location.longitude,
        ));
      fence.geoMarkerIcon = this.geoMarkerIconRegular;
    })

    this.myFences.sort((a, b) =>
      a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0
    );

    if(this.myLocalFence.id != this.myFences[0].id) {
      this.speech('New geo-fence found');
    }

    this.myLocalFence = this.myFences[0];
    this.myLocalFence.geoMarkerIcon = this.geoMarkerIconHighlighted;

    // audio 'sonar' interval based on distance. Max = equiv 100m, otherwise it's too long a gap to be useful
    this.audioInterval = Math.ceil(this.myLocalFence.distance/10) * 200;
    if(this.audioInterval > 2000){ this.audioInterval = 2000 };    

    if (this.myLocalFence.distance <= this.reallyCloseMetres) {
      // Geo-fence is close enough to select
      // Only use speech and change settings when geo-fence has first been triggered
      if(!this.fenceIsReallyClose){
        this.speech('Geo-fence has been triggered');
        this.statusMessage = "Geo-fence REALLY close!";
        this.myGeoMarkerIcon = this.myGeoMarkerIconHighlighted;
        this.fenceIsReallyClose = true;
        this.fenceIsClose = false;  
      } 
      this.canSelectFence = true;

    } else if (this.myLocalFence.distance <= this.closeMetres) {
      // Geo-fence is in the vacinity but not close enough to select
      // Only use speech and change settings when geo-fence first comes into the vacinity
      if(!this.fenceIsClose){
        this.speech('Geo-fence close by');
        this.statusMessage = "Geo-fence close by!"  
        this.fenceIsReallyClose = false; 
        this.fenceIsClose = true;         
      } 
      this.canSelectFence = false;

    } else {
      // No geo-fences are in the vacinity
      this.statusMessage = "No geo-fences nearby";
      this.myGeoMarkerIcon = this.myGeoMarkerIconRegular; 
      this.fenceIsReallyClose = false; 
      this.fenceIsClose = false;    
      this.canSelectFence = false;      
    }
  }

  private trackMyLocation() {
    this.subscribeToLocation = this.locationService.watchMyLocation(true)
      .subscribe(newLocation => {
        this.myLocation.latitude = newLocation.coords.latitude;
        this.myLocation.longitude = newLocation.coords.longitude;
        this.myLocation.accuracy = newLocation.coords.accuracy;

        if(!this.isPlayingLoop){
          this.audioInit();
          if(this.preferences.audioBearing){ 
            this.loopAudio(); 
          }
        }

        if (this.myEvent && this.myFences.length > 0) {
          this.checkForLocalEventFences();
          this.calculateBearing();
        }
      });
    this.trackingMyLocation = true;
    //this.appEventNotifications.push('trackMyLocation');
  }

  private trackMyHeading() {
    this.subscribeToHeading = this.locationService.trackMyHeading()
      .subscribe(data => {
        this.myHeading = +(data.trueHeading.toFixed()); // Use data.magneticHeading?
        //this.appEventNotifications.push(`trackMyHeading: ${this.myHeading}`);
        this.relativeBearing = +(this.locationService.relativeBearing(this.myBearing, this.myHeading).toFixed());
        this.panAudio();
      });
  }

  private unsubscribeHeading() {
    this.subscribeToHeading.unsubscribe();
  }

  private unsubscribeLocation() {
    this.locationService.stopWatchLocation();
    this.subscribeToLocation.unsubscribe();
  }

  private unsubscribeEventFences() {
    this.subscribeToEventFences.unsubscribe();
  }

  calculateBearing() {
    // calculate bearing to closest fence location
    let bearing = this.locationService.bearing(
      this.myLocation.latitude, 
      this.myLocation.longitude,
      this.myLocalFence.location.latitude, 
      this.myLocalFence.location.longitude);

    this.myBearing = +(bearing.toFixed());

    //console.log('bearing', this.myBearing);
    //this.appEventNotifications.push(`calculateBearing: ${this.myBearing}`);
  }
}
