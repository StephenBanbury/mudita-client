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
    let dLat = this.toRadians(lat2-lat1);
    let dLon = this.toRadians(lon2-lon1);
    let a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d * 1000; // in metres
  }

  // https://stackoverflow.com/questions/46590154/calculate-bearing-between-2-points-with-javascript
  bearing(startLat, startLng, destLat, destLng){
    startLat = this.toRadians(startLat);
    startLng = this.toRadians(startLng);
    destLat = this.toRadians(destLat);
    destLng = this.toRadians(destLng);
  
    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
          Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = this.toDegrees(brng);
    return (brng + 360) % 360;
  }
  
  // https://diydrones.com/profiles/blogs/the-difference-between-heading
  relativeBearing(bearing: number, heading: number) {
    let headingToFence = heading - bearing;

    if(headingToFence < 0) {
      headingToFence = headingToFence + 360;
    }
    return headingToFence;
  }
  
  private toRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  private toDegrees(radians) {
    return radians * 180 / Math.PI;
  }
}
