import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorePage } from './explore.page';
//import { HttpClient } from '@angular/common/http';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    //HttpClient,
    RouterModule.forChild([{ path: '', component: ExplorePage }]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCSXgPI_1LG_thKRrq92Mu-rfnnUskP9-w'
    })
  ],
  declarations: [ExplorePage]
})
export class ExplorePageModule {}
