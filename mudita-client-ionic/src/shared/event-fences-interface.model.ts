export interface IEventFences {
  event: {
    id: number,
    title: string,
    description: string
  },
  fences: [
    {
      id: number,
      tag: string
    }
  ]
}
