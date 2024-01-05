import type GetTransactionByRideId from '../../application/usecase/GetTransactionByRideId'
import { type Input } from '../../application/usecase/ProcessPayment'
import type ProcessPayment from '../../application/usecase/ProcessPayment'
import { inject } from '../di/Registry'
import type HttpServer from '../http/HttpServer'

export default class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('processPayment')
  processPayment?: ProcessPayment

  @inject('getTransactionByRideId')
  getTransactionByRideId?: GetTransactionByRideId

  constructor() {
    this.httpServer?.register(
      'post',
      '/process_payment',
      async (params: any, body: Input) => {
        const output = await this.processPayment?.execute(body)
        return output
      },
    )

    this.httpServer?.register(
      'get',
      '/rides/:rideId/transactions',
      async (params: any, body: any) => {
        const output = await this.getTransactionByRideId?.execute(
          params.rideId as string,
        )
        return output
      },
    )
  }
}
