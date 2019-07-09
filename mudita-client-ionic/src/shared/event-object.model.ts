import { FenceObject } from './fence-object-model';

export class EventObject {
  public id: number;
  public title: string;
  public description: string;
  public fences: FenceObject[];
}
