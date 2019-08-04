import { LocationModel } from './location-object.model';
import { GeoMarkerIconModel } from './geo-marker-icon-object.model';

export class FenceModel {
  public id: number;
  public tag: string;
  public location: LocationModel;
  public distance: number;
  // public text: string;
  // public imageUrl: string;
  public selected: boolean;
  public show: boolean;
  public geoMarkerLabel: any;
  public geoMarkerIcon: GeoMarkerIconModel;
  public text: string;
  public textColour: string;
  public bgColour: string;
  public triggered: boolean;
}
