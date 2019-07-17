import { FenceObject } from './fence-object-model';

export interface IEvent {
  data: [
    {
      id: number,
      title: string,
      description: string,
      fences: FenceObject[];
    }
  ]
}
