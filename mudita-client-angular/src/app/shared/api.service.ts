import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUnsplashImage } from './unsplash-image';
import { EventObject } from '../shared/event-object.model';

import { MuditaApi } from '../shared/mock-api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  imageApiUrl = "https://api.unsplash.com/photos/random?count=1&client_id=";
  imageApiKey = "f820c8f4a1e26ac5ed9c1489f3bf986caaaf3215eb863b62f3ec240a00003209";
  textApiUrl = "";
  textApiKey = "";
  soundApiUrl = "";
  soundApiKey = "";

  events: Array<EventObject>

  constructor(private http: HttpClient) { }

  getEventBasicDetails(): Array<EventObject> {
    this.events = new Array<EventObject>();
    const eventsData = MuditaApi;

    eventsData.event.forEach(event => {
      let newEvent = new EventObject();
      newEvent.id = event.eventId;
      newEvent.title = event.title;

      this.events.push(newEvent);
    })

    return this.events;
  }

  getEventDetails(eventId: number) {
    let event: any;
    event = MuditaApi.event.filter(event => event.eventId == eventId);
    return event[0];
  }

  getImage() {
    const url = this.imageApiUrl + this.imageApiKey;
    return this.http.get<IUnsplashImage>(url);
  }

  getText() {

  }

  getSound() {

  }
}
