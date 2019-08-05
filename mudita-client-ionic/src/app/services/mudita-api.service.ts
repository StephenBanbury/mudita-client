import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { MockEventApi as MockEventApi, MockLocationApi } from '../shared/mock-api';
import { IEvents } from '../shared/events-interface.model'
import { IEventFences } from 'src/app/shared/event-fences-interface.model';
import { IFence } from 'src/app/shared/fence-interface.model';
import { FenceModel } from '../shared/fence-object-model';

// `https://mudita.fun/api/v1/events` - all public events
// `https://mudita.fun/api/v1/events/<event id>` - specific event
// `https://mudita.fun/api/v1/fences` - all public fences
// `https://mudita.fun/api/v1/events/<event id>/fences` - all fences for a specific event.

@Injectable({
  providedIn: 'root'
})
export class MuditaApiService {

  private API_URL_BASE = "https://mudita.fun/api";
  private API_CURR_VERSION = "v1"; 

  constructor(private http: HttpClient) { }

  getEvents(): Observable<IEvents> {
    const url = `${this.API_URL_BASE}/${this.API_CURR_VERSION}/events`;
    return this.http.get<IEvents>(url);
  }

  getEventDetails(eventId: number): Observable<IEvents> {
    const url = `${this.API_URL_BASE}/${this.API_CURR_VERSION}/events/${eventId}`;
    return this.http.get<IEvents>(url);
  }

  getEventFences(eventId: number): Observable<IEventFences>  {
    const url = `${this.API_URL_BASE}/${this.API_CURR_VERSION}/events/${eventId}/fences`; 
    return this.http.get<IEventFences>(url);
  }

  getFenceDetails(fenceId: number): Observable<IFence> {
    const url = `${this.API_URL_BASE}/${this.API_CURR_VERSION}/fences/${fenceId}`;
    return this.http.get<IFence>(url);
  }

  mockFenceDetails(fenceId: number): FenceModel {
    let response = new FenceModel();
    response.id = fenceId;
    response.tag = 'My new fence';
    response.text = "This is a placeholder for your on-the-fly-created geofence."
    response.textColour = '#222';
    response.bgColour = '#fff';
    return response;

  }

  // getMockEvents(): Array<EventObject> {
  //   let events = new Array<EventObject>();

  //   MockEventApi.data.forEach(event => {
  //     let newEvent = new EventObject();
  //     newEvent.id = event.id;
  //     newEvent.title = event.title;

  //     events.push(newEvent);
  //   })

  //   return events;
  // }

  // getMockLocations(): LocationObject[] {
  //   let locations = new Array<LocationObject>();

  //   MockLocationApi.location.forEach(loc => {
  //     locations.push({
  //       accuracy: loc.accuracy,
  //       latitude: loc.latitude,
  //       longitude: loc.longitude
  //     })
  //   })
  //   return locations;
  // }
}
