import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared/api.service';
import { IUnsplashImage } from './shared/unsplash-image';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mudita-client';
  imageJsons: IUnsplashImage[] = new Array<IUnsplashImage>();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getImage();
  }

  getImage() {
    this.apiService.getImage()
    .subscribe(photo =>
      this.imageJsons.push(photo[0]) //.urls.raw + '&w=1500&dpi=2') // width + dpi
      //console.log(photo[0].urls.raw + '&w=1500&dpi=2')
    );
  }
}
