import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service'
import { EventObject } from '../../shared/event-object.model'
import { FenceObject } from '../../shared/fence-object-model';
import { LocationObject } from '../../shared/location-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeoMarkerIconObject } from 'src/shared/geo-marker-icon-object.model';

@Component({
  selector: "app-explore",
  templateUrl: "explore.page.html",
  styleUrls: ["explore.page.scss"]
})
export class ExplorePage implements OnInit {
  myEvent: EventObject;

  // I'm using this to inform me what is happening on mobile device as a substitute for console.log
  //appEventNotifications: Array<string> = [];

  myFences: Array<FenceObject> = [];
  myLocalFence: FenceObject;
  title: string = "Mudita Events";
  height = 0;
  myLocation: LocationObject;

  myGeoMarkerLabel: any;
  myGeoMarkerIcon: GeoMarkerIconObject;
  myGeoMarkerIconRegular: GeoMarkerIconObject;
  myGeoMarkerIconHighlighted: GeoMarkerIconObject;

  //geoMarkerLabel: any;
  geoMarkerIconRegular: GeoMarkerIconObject;
  geoMarkerIconHighlighted: GeoMarkerIconObject;

  eventId: number;
  closeMetres: number;
  reallyCloseMetres: number;

  statusMessage: string;
  zoom: number;
  mapType: string;
  canSelectFence: boolean;

  locationObservable: Observable<LocationObject>;
  trackingMyLocation: boolean;

  subscribeToHeading: Subscription;
  subscribeToEventFences: Subscription;
  subscribeToLocation: Subscription;

  myHeading: number;
  myBearing: number;
  myHeadingToFence: number;

  audioContext: AudioContext;
  audioElement: HTMLAudioElement;
  audioSourceNode: MediaElementAudioSourceNode;
  audioPannerNode: StereoPannerNode;

  constructor(
    public platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private muditaApiServce: MuditaApiService
    //private nativeAudio: NativeAudio
  ) {
    this.route.params.subscribe();

    this.height = platform.height() - 56;
    this.myLocalFence = new FenceObject();
    this.myLocation = new LocationObject();
    this.closeMetres = 10;
    this.reallyCloseMetres = 5;
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

    this.myGeoMarkerIcon = this.myGeoMarkerIconRegular
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {

        this.myEvent = new EventObject();
        this.myFences = [];
        this.trackingMyLocation = false;

        const eventId = params["eventId"];
        if (eventId) {
          this.getEventFences(eventId);
        }
      });
  }

  ionViewWillLeave() {
    //console.log('ionViewWillLeave');
    this.unsubscribeEventFences();
    this.unsubscribeHeading();
    this.unsubscribeLocation();
    this.audioElement.pause()
  }

  ngOnDestroy() {
    //console.log('ngOnDestroy');
    this.unsubscribeEventFences();
    this.unsubscribeHeading();
    this.unsubscribeLocation();
  }

  audioInit() {
    this.audioContext = new AudioContext();
    this.audioElement = new Audio('../../assets/120BPM_metronome.mp3');
    this.audioPannerNode = this.audioContext.createStereoPanner()
    this.audioSourceNode = this.audioContext.createMediaElementSource(this.audioElement);

    this.audioSourceNode.connect(this.audioPannerNode)
    this.audioPannerNode.connect(this.audioContext.destination)
    this.audioElement.play()
  }

  panAudio() {
    if(this.myHeadingToFence >= 350 || this.myHeadingToFence <= 10) {
      this.audioPannerNode.pan.value = 0
    }

    if(this.myHeadingToFence < 350 && this.myHeadingToFence >= 180) {
      this.audioPannerNode.pan.value = -1
    }

    if(this.myHeadingToFence > 10 && this.myHeadingToFence < 180) {
      this.audioPannerNode.pan.value = 1;
    }
  }

  //TODO lose this when we have proper locations
  // addMockLocations() {
  //   const locations = this.muditaApiServce.getMockLocations();
  //   let i = 0;
  //   this.myFences.forEach(fence => {
  //     fence.location = locations[i]
  //     i++;
  //   })
  // }

  getEventFences(eventId: number) {
    this.myEvent = new EventObject();
    this.myFences = new Array<FenceObject>();

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
            geoMarkerIcon: this.geoMarkerIconRegular
          })
        })

        if (!this.myLocation) {
          this.myLocation = new LocationObject();
        }

        this.trackMyLocation();
        this.trackMyHeading();
        this.audioInit();

      });
  }

  nextFenceId() {
    return this.myFences.length + 9999;
  }

  onCreateNewFence(event) {
    if (!this.myEvent) {
      return;
    }
    const newFence = new FenceObject();
    const newFenceLocation = new LocationObject();

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
    this.myFences[0].selected = true;
    this.router.navigate(['/tabs/fence'], { queryParams: { eventId: this.eventId, fenceId: this.myFences[0].id } });
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

    //console.log('myLocalFence', this.myFences[0]);

    this.myFences[0].geoMarkerIcon = this.geoMarkerIconHighlighted;

    if (this.myFences[0].distance <= this.reallyCloseMetres) {

      this.statusMessage = "There is a zone REALLY close!";
      this.myLocalFence = this.myFences[0];
      this.canSelectFence = true;
      this.myGeoMarkerIcon = this.myGeoMarkerIconHighlighted;

    } else if (this.myFences[0].distance <= this.closeMetres) {

      this.statusMessage = "There is a zone close by!"

    } else {

      this.statusMessage = "No events nearby";
      this.myGeoMarkerIcon = this.myGeoMarkerIconRegular;
    }
  }

  private trackMyLocation() {
    this.subscribeToLocation = this.locationService.watchMyLocation(true)
      .subscribe(newLocation => {
        this.myLocation.latitude = newLocation.coords.latitude;
        this.myLocation.longitude = newLocation.coords.longitude;
        this.myLocation.accuracy = newLocation.coords.accuracy;

        console.log('tracking MyLocation')
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
        this.myHeading = +(data.trueHeading.toFixed(1)); // Use data.magneticHeading?
        //this.appEventNotifications.push(`trackMyHeading: ${this.myHeading}`);
        this.myHeadingToFence = this.locationService.headingToFence(this.myBearing, this.myHeading);
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
      this.myLocation.longitude, this.myLocation.latitude,
      this.myFences[0].location.longitude, this.myFences[0].location.latitude);

    this.myBearing = +(bearing.toFixed(1));

    //console.log('bearing', this.myBearing);
    //this.appEventNotifications.push(`calculateBearing: ${this.myBearing}`);
  }
}
