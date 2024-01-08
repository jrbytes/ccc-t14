import type ProcessPayment from '../../application/usecase/ProcessPayment'
import { inject } from '../di/Registry'
import type Queue from './Queue'

export default class QueueController {
  @inject('queue')
  queue?: Queue

  @inject('processPayment')
  processPayment?: ProcessPayment

  constructor() {
    void this.queue?.consume(
      'rideCompleted',
      'rideCompleted.processPayment',
      async (input: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.processPayment?.execute(input)
      },
    )
  }
}
