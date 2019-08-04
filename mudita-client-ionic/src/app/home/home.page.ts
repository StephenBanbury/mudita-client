import { Component, OnInit } from '@angular/core';
import { EventModel } from '../shared/event-object.model'
import { MuditaApiService } from '../services/mudita-api.service';
import { Router, NavigationExtras } from '@angular/router';
import { PreferencesModel } from '../shared/preferences-object.model';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {  
  events: Array<EventModel>;
  eventIsSelected: boolean;
  preferences: PreferencesModel;
  title: string = "Mudita Events";

  constructor(
    private muditaApiServce: MuditaApiService, 
    private router: Router,
    private screenOrientation: ScreenOrientation
  ) {
    this.events = new Array<EventModel>();  

    this.preferences = new PreferencesModel();  
    this.preferences.map = true;
    this.preferences.visualBearing = true;
    this.preferences.audioBearing = false;
    this.preferences.speech = true;
    this.preferences.route = false;
  }

  ngOnInit() {
    this.getEvents();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
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
        eventId: event.id,
        preferences: this.preferences
      }
    };
    this.router.navigate(['/tabs/explore/'], navigationExtras);
  }

}
