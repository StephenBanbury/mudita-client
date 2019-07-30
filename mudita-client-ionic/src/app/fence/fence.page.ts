import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MuditaApiService } from '../services/mudita-api.service';
import { EventObject } from 'src/app/shared/event-object.model';
import { FenceObject } from 'src/app/shared/fence-object-model';
import { Subscription } from 'rxjs';

@Component({
  selector: "app-fence",
  templateUrl: "fence.page.html",
  styleUrls: ["fence.page.scss"]
})
export class FencePage implements OnInit {
  myEvent: EventObject;
  myFence: FenceObject;
  myStyles: any;

  subscribeToEvent: Subscription;
  subscribeToFence: Subscription;
  subscribeToEventFences: Subscription;

  constructor(
    private route: ActivatedRoute,
    private muditaApiServce: MuditaApiService
  ) {
    this.route.params.subscribe();
  }

  ngOnInit() {
    console.log('fence page - onInit');
    this.route.queryParams
      .subscribe(params => {
        const eventId = params["eventId"];
        const fenceId = params["fenceId"];
        //this.getEventFence(eventId, fenceId);     
        if (eventId && fenceId) {
          this.getEventDetails(eventId);
          this.getFenceDetails(fenceId);
        }
      });      
  }

  getEventDetails(eventId: number) {
    this.myEvent = new EventObject();
    this.subscribeToEvent = this.muditaApiServce.getEventDetails(eventId)
      .subscribe(event => {
        console.log('getEventDetails', event);
        this.myEvent.id = event.data["id"];
        this.myEvent.title = event.data["title"];
        this.myEvent.description = event.data["description"];
      });
  }

  getFenceDetails(fenceId) {
    this.myFence = new FenceObject();
    this.subscribeToEvent = this.muditaApiServce.getFenceDetails(fenceId)
      .subscribe(fence => {
        console.log('getFenceDetails', fence);
        this.myFence.id = fence.data["id"];
        this.myFence.tag = fence.data["tag"];
        this.myFence.text = fence.data["text"];
        this.myFence.textColour = fence.data["textColour"];
        this.myFence.bgColour = fence.data["bgColour"];

        this.myStyles = {
          'background-color': fence.data["bgColour"],
          'font-color': fence.data["textColour"],
          'font-size': '20px',
          'font-weight': 'bold'
          }

      });
  }

  // another option for getting event and selected fence
  getEventFence(eventId: number, fenceId: number) {
    this.myEvent = new EventObject();
    this.myFence = new FenceObject();

    this.subscribeToEventFences = this.muditaApiServce.getEventFences(eventId)
      .subscribe(eventFences => {
        // console.log('eventFences', eventFences);
        this.myEvent.id = eventFences.event.id;
        this.myEvent.title = eventFences.event.title;
        this.myEvent.description = eventFences.event.description;

        const myFence = eventFences.fences.filter(fence => fence.id == fenceId)[0];
        // console.log('myFence', myFence);
        this.myFence.id = myFence.id;
        this.myFence.tag = myFence.tag;
        this.myFence.text = myFence.text;
        this.myFence.textColour = myFence.textColour;
        this.myFence.bgColour = myFence.bgColour;

      });
  }
  
  // private getImage() {
  //   this.muditaApiServce.getImage().subscribe(
  //     photo => this.imageJsons.push(photo[0]) //.urls.raw + '&w=1500&dpi=2') // width + dpi
  //     //console.log(photo[0].urls.raw + '&w=1500&dpi=2')
  //   );
  // }
}
