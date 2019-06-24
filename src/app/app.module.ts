import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireModule } from '@angular/fire';

//import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from './../environments/environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // material animations
import { MatButtonModule, MatCheckboxModule } from '@angular/material'; // for example

// see https://material.angular.io/guide/getting-started

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCSXgPI_1LG_thKRrq92Mu-rfnnUskP9-w'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
