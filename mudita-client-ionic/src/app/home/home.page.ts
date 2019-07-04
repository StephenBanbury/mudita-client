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

  constructor(private muditaApiServce: MuditaApiService, private navCtrl: NavController, private router: Router) {
    this.myEvent = new EventObject();
    this.events = new Array<EventObject>();
  }

  ngOnInit() {
    this.eventIsSelected = false;
    this.events = this.muditaApiServce.getEventBasicDetails();
  }

  onSelectEvent(event: EventObject) {
    this.eventIsSelected = true;
    this.getEventDataFromApi(event.id);

    // const toast = await this.toastController.create({
    //   message: `${event.title} selected`,
    //   duration: 3000,
    //   position: 'middle'
    // });    
    // toast.present();

    //this.checkForLocalEventFences();
  }

  // TODO check navigation control in docs etc. Is this right, or even the best way?
  navigateToExplore(eventId: number) {
    console.log('eventId', eventId);
    this.navCtrl.navigateForward('tabs/explore');
    //this.router.navigate(['/explore']);
  }

  getEventDataFromApi(eventId: number) {
    const eventData = this.muditaApiServce.getEventDetails(eventId);

    this.myEvent.id = eventData.eventId;
    this.myEvent.title = eventData.title;
    //this.myEvent.fences = new Array<FenceObject>();

    // eventData.fence.forEach(fence => {
    //   const newFence = new FenceObject();
    //   const newFenceLocation = new LocationObject();
    //   newFenceLocation.latitude = fence.latitude;
    //   newFenceLocation.longitude = fence.longitude;
    //   newFence.location = newFenceLocation;
    //   newFence.text = fence.text;
    //   newFence.imageUrl = fence.imageUrl;
    //   newFence.tag = fence.tag;
    //   newFence.selected = true;
    //   this.myEvent.fences.push(newFence);
    // });
  }
}
