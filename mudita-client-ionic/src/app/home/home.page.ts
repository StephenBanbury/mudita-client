import { Component, OnInit } from '@angular/core';
import { EventModel } from '../shared/event-object.model'
import { MuditaApiService } from '../services/mudita-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { PreferencesModel } from '../shared/preferences-object.model';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {  
  events: Array<EventModel>;
  eventIsSelected: boolean;
  preferences: PreferencesModel;

  constructor(
    private muditaApiServce: MuditaApiService, 
    private router: Router
  ) {
    this.events = new Array<EventModel>();  

    this.preferences = new PreferencesModel();  
    this.preferences.map = true;
    this.preferences.visualBearing = false;
    this.preferences.audioBearing = true;
    this.preferences.direction = false;
  }

  ngOnInit() {
    this.getEvents();
  }

  updatePreferences() {
    console.log(this.preferences);
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

  onSelectEvent(event: EventModel) {
    
    let navigationExtras: NavigationExtras = {
      state: {
        event: event,
        preferences: this.preferences
      }
    };

    this.router.navigate(['/tabs/explore/'], navigationExtras);
  }

}
