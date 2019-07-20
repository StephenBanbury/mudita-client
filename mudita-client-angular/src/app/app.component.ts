import { Component } from '@angular/core';
import { EventObject } from 'src/shared/event-object.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Mudita';
  myEvent: EventObject;
  eventIsSelected: boolean;
  showEventList: boolean;

  constructor() {
    this.myEvent = new EventObject();
    this.eventIsSelected = false;
    this.showEventList = true;
  }

  onEventSelected(eventData: EventObject){
    this.myEvent.id = eventData.id;
    this.myEvent.title = eventData.title;
    this.myEvent.description = eventData.description;
    this.eventIsSelected = true;
    this.showEventList = false;
  }

  onToggleEventList(){
    this.showEventList = !this.showEventList;
  }
}
