import type Queue from '../../infra/queue/Queue'
import type Aggregate from '../Aggregate'
import type DomainEvent from './DomainEvent'

export default class EventProxy {
  static createProxy(aggregate: Aggregate, queue: Queue): any {
    aggregate.register(async (event: DomainEvent) => {
      await queue.publish(event.name, event)
    })
    return new Proxy(aggregate, {
      get(target: any, propertyKey: string) {
        console.log('proxy', propertyKey)
        return target[propertyKey]
      },
    })
  }
}
