import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  watchId: number;

  constructor(private geolocation: Geolocation, private deviceOrientation: DeviceOrientation) { }

  watchMyLocation(enableHighAccuracy: boolean): Observable<Geoposition> {
    let options = {
      enableHighAccuracy: enableHighAccuracy,
      timeout: 8000,
      maximumAge: 7000,
    };
    let watch = this.geolocation.watchPosition(options);
    return watch;
  }

  stopWatchLocation() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  trackMyHeading(): Observable<DeviceOrientationCompassHeading> {
    let watch = this.deviceOrientation.watchHeading();
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

  rad2deg(deg) {
    return deg * (180/Math.PI)
  }

  // double bearing(double a1, double a2, double b1, double b2) {
  //   static const double TWOPI = 6.2831853071795865;
  //   static const double RAD2DEG = 57.2957795130823209;
  //   // if (a1 = b1 and a2 = b2) throw an error 
  //   double theta = atan2(b1 - a1, a2 - b2);
  //   if (theta < 0.0)
  //     theta += TWOPI;
  //   return RAD2DEG * theta;
  // }

  bearing(a1: number, a2: number, b1: number, b2: number) {
    const TWOPI = 6.2831853071795865;
    // if (a1 = b1 and a2 = b2) throw an error 
    let theta = Math.atan2(b1-a1, a2-b2);
    if (theta < 0.0)
      theta += TWOPI;
    return this.rad2deg(theta);
  }

  headingToFence(bearing: number, heading: number) {
    let headingToFence = heading - bearing;

    if(headingToFence < 0) {
      headingToFence = headingToFence + 360;
    }
    return +(headingToFence.toFixed(1));
  }
}
