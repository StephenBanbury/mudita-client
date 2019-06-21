import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUnsplashImage } from './unsplash-image';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  imageApiUrl = "https://api.unsplash.com/photos/random?count=1&client_id=";
  imageApiKey = "f820c8f4a1e26ac5ed9c1489f3bf986caaaf3215eb863b62f3ec240a00003209";
  textApiUrl = "";
  textApiKey = "";
  soundApiUrl = "";
  soundApiKey = "";


  constructor(private http: HttpClient) { }

  getImage() {
    const url = this.imageApiUrl + this.imageApiKey;
    return this.http.get<IUnsplashImage>(url);
  }

  getText() {

  }

  getSound() {

  }
}
