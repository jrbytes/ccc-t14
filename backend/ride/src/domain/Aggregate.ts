import type DomainEvent from './event/DomainEvent'

export default class Aggregate {
  private readonly listeners: Array<{ callback: any }>

  constructor() {
    this.listeners = []
  }

  register(callback: any): void {
    this.listeners.push({ callback })
  }

  notify(event: DomainEvent): void {
    for (const listener of this.listeners) {
      listener.callback(event)
    }
  }
}
