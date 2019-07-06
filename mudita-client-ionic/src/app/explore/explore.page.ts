import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { LocationService } from '../../services/location.service'
import { EventObject } from '../../shared/event-object.model'
import { FenceObject } from '../../shared/fence-object-model';
import { LocationObject } from '../../shared/location-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';

import { IUnsplashImage } from '../../shared/unsplash-image';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

@Component({
  selector: "app-explore",
  templateUrl: "explore.page.html",
  styleUrls: ["explore.page.scss"]
})
export class ExplorePage {
  title: string = "Mudita Events";
  height = 0;

  myEvent: EventObject;
  myLocation: LocationObject;
  myMarkerLabelOptions: any;
  myMarkerIconOptions: any;
  eventId: number;
  closeMetres: number;
  reallyCloseMetres: number;

  statusMessage: string;
  zoom: number;

  locationObservable: Observable<LocationObject>;

  imageJsons: IUnsplashImage[] = new Array<IUnsplashImage>();

  constructor(
    private route: ActivatedRoute,
    public platform: Platform,
    private locationService: LocationService,
    private muditaApiServce: MuditaApiService,
    public toastController: ToastController
  ) {
    
    this.route.params.subscribe();
    this.height = platform.height() - 56;
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

    this.route.queryParams.subscribe(params => {
      console.log('params', params);
      this.eventId = params["eventId"];
      if (this.eventId) {
        this.getEventDataFromApi(this.eventId);
      }
      console.log(this.myEvent);

      // const toast = await this.toastController.create({
      //   message: `${event.title} selected`,
      //   duration: 3000,
      //   position: "middle"
      // });
      // toast.present();
    });

    this.trackMyLocation();
  }

  ngOnDestroy() {
    this.stopTrackMyLocation;
  }

  getEventDataFromApi(eventId: number) {
    const eventData = this.muditaApiServce.getEventDetails(eventId);

    this.myEvent = new EventObject();

    this.myEvent.id = eventData.eventId;
    this.myEvent.title = eventData.title;
    this.myEvent.fences = new Array<FenceObject>();

    eventData.fence.forEach(fence => {
      const newFence = new FenceObject();
      const newFenceLocation = new LocationObject();
      newFenceLocation.latitude = fence.latitude;
      newFenceLocation.longitude = fence.longitude;
      newFence.location = newFenceLocation;
      newFence.text = fence.text;
      newFence.imageUrl = fence.imageUrl;
      newFence.tag = fence.tag;
      newFence.selected = true;
      this.myEvent.fences.push(newFence);
    });
    console.log('getEventFromApi', this.myEvent.fences);
  }

  onSelectLocation(event) {
    if (!this.myEvent) {
      return;
    }
    const newFence = new FenceObject();
    const newFenceLocation = new LocationObject();

    newFenceLocation.latitude = event.coords.lat;
    newFenceLocation.longitude = event.coords.lng;

    newFence.location = newFenceLocation;
    newFence.tag = "New fence " + (this.myEvent.fences.length + 1).toString();
    newFence.selected = true;

    this.myEvent.fences.push(newFence);

    this.checkForLocalEventFences();
  }

  trackMyLocation() {
    this.locationService.watchLocation().subscribe(newLocation => {
      this.myLocation.latitude = newLocation.coords.latitude;
      this.myLocation.longitude = newLocation.coords.longitude;
      this.myLocation.accuracy = newLocation.coords.accuracy;
      if (this.myEvent) {
        this.checkForLocalEventFences();
      }
    });
  }

  stopTrackMyLocation() {
    this.locationService.stopWatchLocation();
  }

  private checkForLocalEventFences() {
    console.log("checkForLocalEventFences");

    if (this.myEvent.fences.length == 0) {
      this.statusMessage = "No events nearby";
      return false;
    }

    this.myEvent.fences.forEach(
      e =>
        (e.distance = Math.round(
          this.locationService.getDistanceFromLatLonInKm(
            this.myLocation.latitude,
            this.myLocation.longitude,
            e.location.latitude,
            e.location.longitude
          )
        ))
    );

    this.myEvent.fences.sort((a, b) =>
      a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0
    );

    if (this.myEvent.fences[0].distance <= this.closeMetres) {
      this.statusMessage = "There is a zone close by!"; // Here's a random image from Unsplash's API for you..';
      this.myMarkerIconOptions = {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: {
          width: 40,
          height: 40
        }
      };
      // if(this.imageJsons.length == 0){
      //   this.getImage();
      // }
    } else {
      this.statusMessage = "No zones nearby";
      this.myMarkerIconOptions = {
        url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
        scaledSize: {
          width: 40,
          height: 40
        }
      };
      //this.imageJsons = new Array<IUnsplashImage>();
    }
  }

  private getImage() {
    this.muditaApiServce.getImage().subscribe(
      photo => this.imageJsons.push(photo[0]) //.urls.raw + '&w=1500&dpi=2') // width + dpi
      //console.log(photo[0].urls.raw + '&w=1500&dpi=2')
    );
  }
}
