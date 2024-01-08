import type RequestRide from '../../application/usecase/RequestRide'
import type UpdateRideProjectionAPIComposition from '../../application/usecase/UpdateRideProjectionAPIComposition'
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

  @inject('updateRideProjection')
  updateRideProjection?: UpdateRideProjectionAPIComposition

  constructor() {
    void this.queue?.consume(
      'paymentApproved',
      'paymentApproved.sendReceipt',
      async (input: any) => {
        await this.sendReceipt?.execute(input)
      },
    )

    void this.queue?.consume(
      'requestRide',
      'requestRide.requestRide',
      async (input: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.requestRide?.execute(input)
      },
    )

    void this.queue?.consume(
      'rideCompleted',
      'rideCompleted.updateProjection',
      async (input: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.updateRideProjection?.execute(input)
      },
    )
  }
}
