import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared/api.service';
import { IUnsplashImage } from './shared/unsplash-image';
import { LocationObject } from './shared/location-object.model';
import { EventObject } from './shared/event-object.model';
import { Observable } from 'rxjs';
import { LocationService } from './shared/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mudita-client';
  private interval: any;

  myLocation: LocationObject;
  events: Array<EventObject>;
  statusMessage: string;
  zoom: number;
  myMarkerLabelOptions: any;
  myMarkerIconOptions: any;

  locationObservable: Observable<LocationObject>;

  imageJsons: IUnsplashImage[] = new Array<IUnsplashImage>();

  constructor(private apiService: ApiService, private locationService: LocationService) {
    this.myLocation = new LocationObject();
    this.events = new Array<EventObject>();
    //this.eventLocations.push(new LocationObject());
    this.zoom = 17;
    this.myMarkerLabelOptions = {
      color: '#000',
      fontFamily: '',
      fontSize: '16px',
      fontWeight: 'bold',
      text: 'Me',
    }
    this.myMarkerIconOptions = {
      url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      scaledSize: {
        width: 40,
        height: 40
      }
    }
  }

  ngOnInit() {
    this.trackMyLocation();
  }

  ngOnDestroy() {
    this.stopTrackMyLocation
  }

  // TODO this may be used to for something, so it's staying here for now
  start() {
    this.interval = setInterval(() => {
      this.frame();
    }, 30 * 60);
  }

  private frame() {
  }

  onSelectLocation(event) {
    const newEvent = new EventObject();
    const newEventLocation = new LocationObject();

    newEventLocation.latitude = event.coords.lat;
    newEventLocation.longitude = event.coords.lng;

    newEvent.location = newEventLocation;
    newEvent.selected = true;

    this.events.push(newEvent);

    this.checkForLocalEvents();
  }

  trackMyLocation() {
    this.locationService.watchLocation().subscribe(
      newLocation => {
        this.myLocation.latitude = newLocation.coords.latitude;
        this.myLocation.longitude = newLocation.coords.longitude;
        this.myLocation.accuracy = newLocation.coords.accuracy;

        this.checkForLocalEvents();
      }
    )
  }

  stopTrackMyLocation() {
    this.locationService.stopWatchLocation();
  }

  private checkForLocalEvents() {
    if(this.events.length == 0){
      this.statusMessage = 'No events nearby';
      return false;
    }

    this.events.forEach(e => e.distance = Math.round(
      this.locationService.getDistanceFromLatLonInKm(
      this.myLocation.latitude, this.myLocation.longitude,
      e.location.latitude, e.location.longitude)));

    this.events.sort((a, b) => a.distance < b.distance ? -1 : a.distance > b.distance ? 1 : 0);

    if(this.events[0].distance <= 20){
      this.statusMessage = "There is an event close by! Here's a random image from Unsplash's API for you..";
      if(this.imageJsons.length == 0){
        this.getImage();
      }
    } else {
      this.statusMessage = "No events nearby";
      this.imageJsons = new Array<IUnsplashImage>();
    }
  }

  private getImage() {
    this.apiService.getImage()
    .subscribe(photo =>
      this.imageJsons.push(photo[0]) //.urls.raw + '&w=1500&dpi=2') // width + dpi
      //console.log(photo[0].urls.raw + '&w=1500&dpi=2')
    );
  }
}
