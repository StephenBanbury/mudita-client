import { Component, OnInit } from '@angular/core';
import { EventObject } from '../shared/event-object.model'
import { MuditaApiService } from '../services/mudita-api.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {  
  events: Array<EventObject>;
  eventIsSelected: boolean;
  preferences: any;

  constructor(
    private muditaApiServce: MuditaApiService, 
    private router: Router
  ) {
    this.events = new Array<EventObject>();
    
    // this.preferences = [
    //   {
    //     id: '1',
    //     name: 'showMap',
    //     text: 'Show map',
    //     disabled: false,
    //     checked: true
    //   }, {
    //     id: '2',
    //     name: 'showGeoInfo',
    //     text: 'Show geolocation information',
    //     disabled: false,
    //     checked: false
    //   }, {
    //     id: '3',
    //     name: 'useAudio',
    //     text: 'Use audio',
    //     disabled: false,
    //     checked: true
    //   },
    // ];
  }

  ngOnInit() {
    this.getEvents();

    this.preferences = {
      showMap: true,
      showGeoInfo: false,
      useAudio: true
    }
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
    
    let navigationExtras: NavigationExtras = {
      state: {
        event: event,
        preferences: this.preferences
      }
    };

    this.router.navigate(['/tabs/explore/'], navigationExtras);
  }

}
