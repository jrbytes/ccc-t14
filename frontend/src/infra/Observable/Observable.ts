export default class Observable {
  private readonly listeners: Array<{ callback: any }>

  constructor() {
    this.listeners = []
  }

  register(callback: any): void {
    this.listeners.push({ callback })
  }

  notify(event: any): void {
    for (const listener of this.listeners) {
      listener.callback(event)
    }
  }
}
