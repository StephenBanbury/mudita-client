export interface IEventFences {
  event: {
    id: number,
    title: string,
    description: string
  },
  fences: [
    {
      id: number,
      tag: string,
      latitude: number,
      longitude: number,
      text: string,
      textColour: string,
      bgColour: string
    }
  ]
}
