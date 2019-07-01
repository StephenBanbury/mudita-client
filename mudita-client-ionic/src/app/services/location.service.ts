import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  watchId: number;

  constructor() { }

  watchLocation(): Observable<any> {
    return Observable.create(observer => {
      if (navigator.geolocation) {
        this.watchId = navigator.geolocation.watchPosition(position => {
          observer.next(position);
          observer.complete;
          //console.log('watchLocationObservable', position);
        },
          (error: PositionError) => console.log(error),
          { enableHighAccuracy: true }
        )
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    });
  }

  stopWatchLocation() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1);
    let a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d * 1000; // in metres
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
}
