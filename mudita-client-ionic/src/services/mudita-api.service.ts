import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IUnsplashImage } from '../shared/unsplash-image';
import { EventObject } from '../shared/event-object.model';
import { IEvent } from '../shared/event-interface.model'
import { Observable } from 'rxjs';

import { MockEventApi as MockEventApi } from '../shared/mock-event-api';
import { MockFenceApi as MockFenceApi } from '../shared/mock-fence-api';
import { FenceObject } from 'src/shared/fence-object-model';
import { FencePage } from 'src/app/fence/fence.page';
import { LocationObject } from 'src/shared/location-object.model';

@Injectable({
  providedIn: 'root'
})
export class MuditaApiService {

  eventsApiUrl = "https://mudita.fun/api/v1/events";
  imageApiUrl = "https://api.unsplash.com/photos/random?count=1&client_id=";
  imageApiKey = "f820c8f4a1e26ac5ed9c1489f3bf986caaaf3215eb863b62f3ec240a00003209";
  textApiUrl = "";
  textApiKey = "";
  soundApiUrl = "";
  soundApiKey = "";
  
  // GetHttpHeaders() : HttpHeaders{
  //   const headers = new HttpHeaders()
  //   .append('content-type', 'application/json')
  //   .append('Access-Control-Allow-Origin', '*');
  //   return headers;
  // }

  constructor(private http: HttpClient) { }

  getMockEventsBasicDetails(): Array<EventObject> {
    let events = new Array<EventObject>();

    MockEventApi.data.forEach(event => {
      let newEvent = new EventObject();
      newEvent.id = event.id;
      newEvent.title = event.title;

      events.push(newEvent);
    })

    // eventsData.event.forEach(event => {
    //   let newEvent = new EventObject();
    //   newEvent.id = event.eventId;
    //   newEvent.title = event.title;

    //   events.push(newEvent);
    // })

    return events;
  }

  // getEventsBasicDetails(): Observable<HttpResponse<IEvent>> {
  //   //return this.http.get<IEvent>(this.eventsApiUrl);       
  //   return this.http.get<IEvent>(this.eventsApiUrl, { observe: 'response' });       
  //   //return this.http.get<IEvent>(this.eventsApiUrl, { headers: this.GetHttpHeaders(), observe: 'response' });       
  // }

  getEventsBasicDetails(): Observable<IEvent> {
    return this.http.get<IEvent>(this.eventsApiUrl);       
    //return this.http.get<IEvent>(this.eventsApiUrl, { observe: 'response' });       
    //return this.http.get<IEvent>(this.eventsApiUrl, { headers: this.GetHttpHeaders(), observe: 'response' });       
  }

  getEvents(): Observable<IEvent>  {
    const url = this.eventsApiUrl; 
    //return this.http.get<IEvent>(url);
    
    let events = this.http.get<IEvent>(url)
    
    events.subscribe(  
      event => { 
        console.log('event from Api', event);
      }
    );

    return events;
      
  }

  getEventDetails(eventId: number): EventObject {
    const event = MockEventApi.data.filter(event => event.id == eventId);
    const fenceData = MockFenceApi.data.filter(event => event.eventId == eventId);

    let myEvent = new EventObject();
    myEvent.id = event[0].id;
    myEvent.title = event[0].title;
    myEvent.description = event[0].description;
    myEvent.fences = new Array<FenceObject>();

    if (fenceData.length > 0) {
      fenceData[0].fences.forEach(f => {
        let myFence = new FenceObject();
        myFence.id = f.fenceId;
        myFence.tag = f.tag;
        myFence.text = f.text;
        myFence.imageUrl = f.imageUrl;

        let myFenceLocation = new LocationObject();
        myFenceLocation.latitude = f.latitude;
        myFenceLocation.longitude = f.longitude;
        myFence.location = myFenceLocation;

        myEvent.fences.push(myFence);
      })
    }

    return myEvent;
  }

  // getEventDetails(eventId: number) {
  //   let event: any;
  //   event = MockEventApi.data.filter(event => event.id == eventId);
  //   return event[0];
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
