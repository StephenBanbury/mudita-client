import { Component, OnInit } from '@angular/core';
import { EventObject } from '../../shared/event-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';
//import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: "app-select-event",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class SelectEventPage implements OnInit {
  myEvent: EventObject;
  events: Array<EventObject>;
  eventIsSelected: boolean;

  constructor(
    private muditaApiServce: MuditaApiService, 
    private router: Router
  ) {
    this.myEvent = new EventObject();
    this.events = new Array<EventObject>();
  }

  ngOnInit() {
    this.eventIsSelected = false;
    this.events = this.muditaApiServce.getEventBasicDetails();
    console.log(this.events);
    
    // this.muditaApiServce.getEvents().subscribe( 
    //   event => { 
    //     console.log('event from Api', event);
    //   }
    // );

  }

  onSelectEvent(event: EventObject) {
    this.myEvent = event;
    this.router.navigate(['/tabs/explore'], { queryParams: { eventId: event.id } });
  }

  getEventDataFromApi(eventId: number) {
    const eventData = this.muditaApiServce.getEventDetails(eventId);

    this.myEvent.id = eventData.id;
    this.myEvent.title = eventData.title;
  }
}
