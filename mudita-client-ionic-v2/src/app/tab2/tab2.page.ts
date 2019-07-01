import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;
  height = 0;
  
  constructor(public platform: Platform) {
    console.log(platform.height());
    this.height = platform.height() - 56;
  }
}
