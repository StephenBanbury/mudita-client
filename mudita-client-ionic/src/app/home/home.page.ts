import { Component, OnInit } from '@angular/core';
import { EventObject } from '../../shared/event-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
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
  }

  onSelectEvent(event: EventObject) {
    this.router.navigate(['/tabs/explore'], { queryParams: { eventId: event.id } });
  }

  getEventDataFromApi(eventId: number) {
    const eventData = this.muditaApiServce.getEventDetails(eventId);

    this.myEvent.id = eventData.eventId;
    this.myEvent.title = eventData.title;
  }
}
