import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  watchId: number;

  constructor(private geolocation: Geolocation, private deviceOrientation: DeviceOrientation) { }

  watchMyLocation(): Observable<Geoposition> {
    let options = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 7000,
    };
    let watch = this.geolocation.watchPosition(options);
    return watch;
  }

  stopWatchLocation() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  trackMyHeading() {
    let watch = this.deviceOrientation.watchHeading()
    return watch;
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
