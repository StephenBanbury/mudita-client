import { LocationObject } from './location-object.model';

export class FenceObject {
  public id: number;
  public tag: string;
  public location: LocationObject;
  public distance: number;
  public text: string;
  public imageUrl: string;
  public selected: boolean;
}
