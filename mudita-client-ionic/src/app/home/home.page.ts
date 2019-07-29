import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { EventObject } from '../../shared/event-object.model'
import { MuditaApiService } from '../../services/mudita-api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {  
  events: Array<EventObject>;
  eventIsSelected: boolean;

  @Output() eventSelected = new EventEmitter<EventObject>();

  constructor(
    private muditaApiServce: MuditaApiService, 
    private router: Router,
  ) {
    this.events = new Array<EventObject>();
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.muditaApiServce.getEvents()
    .subscribe(events => {
        events.data.forEach(e => {
          //console.log('event', e)
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
    this.router.navigate(['/tabs/explore/'], { queryParams: { eventId: event.id } });
  }

}
