import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EventObject } from '../../shared/event-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';
//import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IEvent } from 'src/shared/event-interface.model';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  event: IEvent;
  myEvent: EventObject;
  events: Array<EventObject>;

  @Output() eventSelected = new EventEmitter<EventObject>();

  constructor(
    private muditaApiServce: MuditaApiService,
    //private router: Router
  ) {
    this.myEvent = new EventObject();
    this.events = new Array<EventObject>();
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.muditaApiServce.getEvents()
    .subscribe(events => {
        events.data.forEach(e => {
          this.events.push({
            id: e.id,
            title: e.title,
            description: e.description
          });
        });
      }
    );
  }

  onSelectEvent(event: EventObject) {
    //this.router.navigate(['/tabs/explore'], { queryParams: { eventId: event.id } });
    this.eventSelected.emit({
      id: event.id,
      title: event.title,
      description: event.description
    });
  }

  // getEventDataFromApi(eventId: number) {
  //   const eventData = this.muditaApiServce.getEventDetails(eventId);

  //   this.myEvent.id = eventData.id;
  //   this.myEvent.title = eventData.title;
  // }
}
