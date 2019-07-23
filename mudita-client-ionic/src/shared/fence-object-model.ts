import { LocationObject } from './location-object.model';
import { GeoMarkerIconObject } from './geo-marker-icon-object.model';

export class FenceObject {
  public id: number;
  public tag: string;
  public location: LocationObject;
  public distance: number;
  // public text: string;
  // public imageUrl: string;
  public selected: boolean;
  public show: boolean;
  public geoMarkerIcon: GeoMarkerIconObject;
}
