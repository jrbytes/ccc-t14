export default class Mediator {
  handlers: Array<{ eventName: string; usecase: any }>

  constructor() {
    this.handlers = []
  }

  register(eventName: string, usecase: any): void {
    this.handlers.push({ eventName, usecase })
  }

  async publish(eventName: string, data: any): Promise<any> {
    for (const handler of this.handlers) {
      if (handler.eventName === eventName) {
        await handler.usecase.execute(data)
      }
    }
  }
}
