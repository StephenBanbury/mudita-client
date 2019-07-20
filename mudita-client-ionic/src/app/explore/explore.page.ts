import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { LocationService } from '../../services/location.service'
import { EventObject } from '../../shared/event-object.model'
import { FenceObject } from '../../shared/fence-object-model';
import { LocationObject } from '../../shared/location-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { IUnsplashImage } from '../../shared/unsplash-image';

@Component({
  selector: "app-explore",
  templateUrl: "explore.page.html",
  styleUrls: ["explore.page.scss"]
})
export class ExplorePage implements OnInit {
  @Input() myEvent: EventObject;
  myFences: Array<FenceObject>;
  title: string = "Mudita Events";
  height = 0;
  myLocation: LocationObject;
  myMarkerLabelOptions: any;
  myMarkerIconOptions: any;
  eventId: number;
  closeMetres: number;
  reallyCloseMetres: number;
  statusMessage: string;
  zoom: number;
  mapType: string;
  locationObservable: Observable<LocationObject>;
  trackingMyLocation: boolean;
  headingSubscription: Subscription;
  myHeading: any;

  constructor(
    public platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private muditaApiServce: MuditaApiService
  ) {
    this.route.params.subscribe();

    this.height = platform.height() - 56;
    this.myFences = new Array<FenceObject>();
    this.myLocation = new LocationObject();
    this.closeMetres = 10;
    this.reallyCloseMetres = 5;
    this.zoom = 18;
    this.mapType = "roadmap";

    this.myMarkerLabelOptions = {
      color: "#000",
      fontFamily: "",
      fontSize: "16px",
      fontWeight: "bold",
      text: "ME"
    };
    this.myMarkerIconOptions = {
      url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      scaledSize: {
        width: 40,
        height: 40
      }
    };
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const eventId = params["eventId"];
      if (eventId) {
        this.getEventFences(eventId);
        if(this.trackingMyLocation) {
          this.checkForLocalEventFences();
        }
      }
    });

    this.trackMyLocation();
    this.trackMyHeading(); 
  }

  ngOnDestroy() {
    this.stopTrackMyHeading();
    this.stopTrackMyLocation();    
  }

  //TODO lose this when we have proper locations
  addMockLocations() {
    const locations = this.muditaApiServce.getMockLocations();
    let i = 0;
    this.myFences.forEach(fence => {
      fence.location = locations[i]
      i++;
    })
  }

  getEventFences(eventId: number) {
    this.myEvent = new EventObject();
    this.myFences = new Array<FenceObject>();

    this.muditaApiServce.getEventFences(eventId)
      .subscribe(eventFences => {
        this.myEvent.id = eventFences.event.id;
        this.myEvent.title = eventFences.event.title;
        this.myEvent.description = eventFences.event.description;
        eventFences.fences.forEach(fence => {
          this.myFences.push({
            id: fence.id,
            tag: fence.tag,
            location: new LocationObject(), //TODO
            distance: 0,
            selected: false,
            show: true
          })
        })

        //TODO lose this when we have proper locations
        this.addMockLocations();

        if (this.trackingMyLocation) {
          this.checkForLocalEventFences();
        }
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
    newFence.selected = false;
    newFence.show = true;
    this.myFences.push(newFence);

    this.checkForLocalEventFences();
  }

  onSelectFence() {
     this.router.navigate(['/tabs/fence'], { queryParams: { eventId: this.eventId, fenceId: this.myFences[0].id } });
  }

  private checkForLocalEventFences() {
    if (this.myFences.length == 0) {
      this.statusMessage = "This event has no fences!";
      return false;
    }

    for(let i: number = 0; i <= this.myFences.length -1; i++){
      let fence = this.myFences[i];
      fence.distance = Math.round(
        this.locationService.getDistanceFromLatLonInKm(
          this.myLocation.latitude,
          this.myLocation.longitude,
          fence.location.latitude,
          fence.location.longitude
        ));
      fence.show = true;
      fence.selected = fence.distance <= this.reallyCloseMetres;
    }

    this.myFences.sort((a, b) =>
      a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0
    );

    if (this.myFences[0].distance <= this.reallyCloseMetres) {
      this.statusMessage = "There is a zone REALLY close!"; 
      this.myMarkerIconOptions = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: {
          width: 40,
          height: 40
        }
      };
    } else if (this.myFences[0].distance <= this.closeMetres) {
      this.statusMessage = "There is a zone close by!"
    } else {
      this.statusMessage = "No events nearby";
      this.myMarkerIconOptions = {
        url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        scaledSize: {
          width: 40,
          height: 40
        }
      };
    }
  }

  private trackMyLocation() {
    this.locationService.watchMyLocation().subscribe(
      newLocation => {
        this.myLocation.latitude = newLocation.coords.latitude;
        this.myLocation.longitude = newLocation.coords.longitude;
        this.myLocation.accuracy = newLocation.coords.accuracy;
        if (this.myEvent) {
          this.checkForLocalEventFences();
        }
    });
    this.trackingMyLocation = true;
  }

  private stopTrackMyLocation() {
    this.locationService.stopWatchLocation();
  }

  private trackMyHeading() {
    this.headingSubscription = this.locationService.trackMyHeading()
      .subscribe(data => {
        this.myHeading = data.magneticHeading;
      });
  }

  private stopTrackMyHeading() {
    this.headingSubscription.unsubscribe();
  }

}
