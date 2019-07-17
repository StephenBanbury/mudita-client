import { Component, OnInit } from '@angular/core';
import { EventObject } from '../../shared/event-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';
//import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IEvent } from 'src/shared/event-interface.model';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {  
  //headers: string[];
  event: IEvent;
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
    this.muditaApiServce.getEventsBasicDetails().subscribe(
      events => {
        //console.log('event from Api', events.data);
        events.data.forEach(e => {
          this.events.push({
            id: e.id,
            title: e.title,
            description: e.description,
            fences: e.fences
          });
        });
      }
    );
  }

  onSelectEvent(event: EventObject) {
    this.router.navigate(['/tabs/explore'], { queryParams: { eventId: event.id } });
  }

  getEventDataFromApi(eventId: number) {
    const eventData = this.muditaApiServce.getEventDetails(eventId);

    this.myEvent.id = eventData.id;
    this.myEvent.title = eventData.title;
  }
}
