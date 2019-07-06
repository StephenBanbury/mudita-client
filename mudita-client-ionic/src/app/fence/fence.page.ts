import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-fence",
  templateUrl: "fence.page.html",
  styleUrls: ["fence.page.scss"]
})
export class Fence implements OnInit {

  eventId:number;
  fenceId:number;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe();
  }

  ngOnInit() {
    console.log('onInit');
    this.route.queryParams.subscribe(params => {
      this.eventId = params["eventId"];
      this.fenceId = params["fenceId"];
      console.log('subscribed to params. eventId:', this.eventId);
      console.log('subscribed to params. fenceId:', this.fenceId);
    })
  }
}
