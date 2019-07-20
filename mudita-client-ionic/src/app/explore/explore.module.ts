import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorePage } from './explore.page';
import { AgmCoreModule } from '@agm/core';          
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ExplorePage }]),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCSXgPI_1LG_thKRrq92Mu-rfnnUskP9-w'
    }),
    AgmDirectionModule  
  ],
  declarations: [
    ExplorePage
  ]
})
export class ExplorePageModule {}
