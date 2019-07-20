import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MuditaApiService } from '../../services/mudita-api.service';
import { IUnsplashImage } from '../../shared/unsplash-image';

@Component({
  selector: "app-fence",
  templateUrl: "./fence.component.html",
  styleUrls: ["./fence.component.css"]
})
export class FenceComponent implements OnInit {

  eventId:number;
  fenceId:number;
  imageJsons: IUnsplashImage[] = new Array<IUnsplashImage>();

  constructor(
    private route: ActivatedRoute,
    private muditaApiServce: MuditaApiService
  ) {
    this.route.params.subscribe();
  }

  ngOnInit() {
    console.log('onInit');
    this.route.queryParams.subscribe(params => {
      this.eventId = params["eventId"];
      this.fenceId = params["fenceId"];
      if (this.eventId && this.fenceId) {
        console.log('subscribed to params. eventId:', this.eventId);
        console.log('subscribed to params. fenceId:', this.fenceId);
        // this.getEventDataFromApi(this.eventId);
        // if(this.trackingMyLocation) {
        //   this.checkForLocalEventFences();
        // }
        this.getImage();
      }

    })
  }

  private getImage() {
    this.muditaApiServce.getImage().subscribe(
      photo => this.imageJsons.push(photo[0]) //.urls.raw + '&w=1500&dpi=2') // width + dpi
      //console.log(photo[0].urls.raw + '&w=1500&dpi=2')
    );
  }
}
