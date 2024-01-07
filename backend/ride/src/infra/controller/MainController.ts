import type RequestRide from '../../application/usecase/RequestRide'
import { inject } from '../di/Registry'
import type HttpServer from '../http/HttpServer'
import type Queue from '../queue/Queue'

export default class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('requestRide')
  requestRide?: RequestRide

  @inject('queue')
  queue?: Queue

  constructor() {
    this.httpServer?.register(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const output = await this.requestRide?.execute(body)
        return output
      },
    )
    this.httpServer?.register(
      'post',
      '/request_ride_async',
      async (params: any, body: any) => {
        await this.queue?.publish('requestRide', body)
      },
    )
  }
}
