import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUnsplashImage } from '../shared/unsplash-image';
import { EventObject } from '../shared/event-object.model';
import { Observable } from 'rxjs';
import { MockEventApi as MockEventApi, MockLocationApi } from '../shared/mock-api';
import { IEvent } from '../shared/event-interface.model'
import { IEventFences } from 'src/shared/event-fences-interface.model';
import { LocationObject } from 'src/shared/location-object.model';

// `https://mudita.fun/api/v1/events` - all public events
// `https://mudita.fun/api/v1/events/<event id>` - specific event
// `https://mudita.fun/api/v1/fences` - all public fences
// `https://mudita.fun/api/v1/events/<event id>/fences` - all fences for a specific event.

@Injectable({
  providedIn: 'root'
})
export class MuditaApiService {

  eventsApiUrl = "https://mudita.fun/api/v1/events";
  imageApiUrl = "https://api.unsplash.com/photos/random?count=1&client_id=";
  imageApiKey = "f820c8f4a1e26ac5ed9c1489f3bf986caaaf3215eb863b62f3ec240a00003209";

  constructor(private http: HttpClient) { }

  getEvents(): Observable<IEvent> {
    return this.http.get<IEvent>(this.eventsApiUrl);
  }

  getEventFences(eventId: number): Observable<IEventFences>  {
    const url = `${this.eventsApiUrl}/${eventId}/fences`;
    return this.http.get<IEventFences>(url);
  }

  getMockEvents(): Array<EventObject> {
    let events = new Array<EventObject>();

    MockEventApi.data.forEach(event => {
      let newEvent = new EventObject();
      newEvent.id = event.id;
      newEvent.title = event.title;

      events.push(newEvent);
    })

    return events;
  }

  getMockLocations(): LocationObject[] {
    let locations = new Array<LocationObject>();

    MockLocationApi.location.forEach(loc => {
      locations.push({
        accuracy: loc.accuracy,
        latitude: loc.latitude,
        longitude: loc.longitude
      })
    })
    return locations;
  }

  // getMockEventDetails(eventId: number, includeFences: boolean): EventObject {
  //   const event = MockEventApi.data.filter(event => event.id == eventId);
  //   const fenceData = MockFenceApi.data.filter(event => event.eventId == eventId);

  //   let myEvent = new EventObject();
  //   myEvent.id = event[0].id;
  //   myEvent.title = event[0].title;
  //   myEvent.description = event[0].description;
  //   myEvent.fences = new Array<FenceObject>();

  //   if (fenceData.length > 0) {
  //     fenceData[0].fences.forEach(f => {
  //       let myFence = new FenceObject();
  //       myFence.id = f.fenceId;
  //       myFence.tag = f.tag;
  //       myFence.text = f.text;
  //       myFence.imageUrl = f.imageUrl;

  //       let myFenceLocation = new LocationObject();
  //       myFenceLocation.latitude = f.latitude;
  //       myFenceLocation.longitude = f.longitude;
  //       myFence.location = myFenceLocation;

  //       myEvent.fences.push(myFence);
  //     })
  //   }

  //   return myEvent;
  // }

  getImage() {
    const url = this.imageApiUrl + this.imageApiKey;
    return this.http.get<IUnsplashImage>(url);
  }

  getText() {

  }

  getSound() {

  }
}
