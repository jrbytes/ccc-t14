import type RequestRide from '../../application/usecase/RequestRide'
import type SendReceipt from '../../domain/SendReceipt'
import { inject } from '../di/Registry'
import type Queue from './Queue'

export default class QueueController {
  @inject('queue')
  queue?: Queue

  @inject('sendReceipt')
  sendReceipt?: SendReceipt

  @inject('requestRide')
  requestRide?: RequestRide

  constructor() {
    void this.queue?.consume('paymentApproved', async (input: any) => {
      await this.sendReceipt?.execute(input)
    })

    void this.queue?.consume('requestRide', async (input: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.requestRide?.execute(input)
    })
  }
}
