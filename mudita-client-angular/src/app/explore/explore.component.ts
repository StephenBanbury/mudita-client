import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { LocationService } from '../../services/location.service'
import { EventObject } from '../../shared/event-object.model'
import { FenceObject } from '../../shared/fence-object-model';
import { LocationObject } from '../../shared/location-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';

import { IUnsplashImage } from '../../shared/unsplash-image';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-explore",
  templateUrl: "explore.component.html",
  styleUrls: ["explore.component.css"]
})
export class ExploreComponent {
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
  locationObservable: Observable<LocationObject>;
  trackingMyLocation: boolean;
  //imageJsons: IUnsplashImage[] = new Array<IUnsplashImage>();

  constructor(
    //private router: Router,
    //private route: ActivatedRoute,
    private locationService: LocationService,
    private muditaApiServce: MuditaApiService,
  ) {
    console.log('constructor');
    //this.route.params.subscribe();

    this.myFences = new Array<FenceObject>();
    this.myLocation = new LocationObject();
    this.closeMetres = 10;
    this.reallyCloseMetres = 5;
    this.zoom = 18;

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
    console.log('onInit');
    if(this.myEvent){
      this.getEventFences();
    }
    this.trackMyLocation();
  }

  //TODO lose this when we have proper locations
  addMockLocations() {
    const locations = this.muditaApiServce.getMockLocations();
    let i = 0;
    this.myFences.forEach(fence => {
      fence.location = locations[i]
    })
    i++;
  }

  ngOnDestroy() {
    this.stopTrackMyLocation();
  }

  getEventFences() {
    this.myFences = new Array<FenceObject>();
    this.muditaApiServce.getEventFences(this.myEvent.id)
      .subscribe(eventFences => {
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
        console.log('myFences', this.myFences);
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

    console.log('newFence',newFence);

    this.myFences.push(newFence);

    this.checkForLocalEventFences();
  }

  onSelectFence() {
  //   //console.log('onSelectFence', `eventId: ${this.eventId}, fenceId: ${this.myEvent.fences[0].id}`);
  //   this.router.navigate(['/tabs/fence'], { queryParams: { eventId: this.eventId, fenceId: this.myEvent.fences[0].id } });
  }

  private checkForLocalEventFences() {
    console.log("checkForLocalEventFences");

    if (this.myFences.length == 0) {
      this.statusMessage = "This event has no fences!";
      return false;
    }

    for(let i: number = 0; i <= this.myFences.length -1; i++){
      let fence = this.myFences[i]; // this.myEvent.fences[i];
      fence.distance = Math.round(
        this.locationService.getDistanceFromLatLonInKm(
          this.myLocation.latitude,
          this.myLocation.longitude,
          fence.location.latitude,
          fence.location.longitude
        ));
      fence.show = true; //fence.distance <= this.reallyCloseMetres;
      fence.selected = fence.distance <= this.reallyCloseMetres;
    }

    this.myFences.sort((a, b) =>
      a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0
    );

    if (this.myFences[0].distance <= this.reallyCloseMetres) {
      //this.myEvent.fences[0].show = true;
      this.statusMessage = "There is a zone REALLY close!"; // Here's a random image from Unsplash's API for you..';
      this.myMarkerIconOptions = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: {
          width: 40,
          height: 40
        }
      };
    } else if (this.myFences[0].distance <= this.closeMetres) {
      this.statusMessage = "There is a zone close by!"
      //this.imageJsons = new Array<IUnsplashImage>();
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

  trackMyLocation() {
    console.log('trackMyLocation');
    this.locationService.watchMyLocation().subscribe(
      newLocation => {
        console.log('subscribed to location service. newLocation:', newLocation);
        this.myLocation.latitude = newLocation.coords.latitude;
        this.myLocation.longitude = newLocation.coords.longitude;
        this.myLocation.accuracy = newLocation.coords.accuracy;
        if (this.myEvent) {
          //this.checkForLocalEventFences();
        }
    });
    this.trackingMyLocation = true;
  }

  private stopTrackMyLocation() {
    this.locationService.stopWatchLocation();
  }
}
