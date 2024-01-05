import { inject } from '../di/Registry'
import type HttpServer from '../http/HttpServer'

export default class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  // constructor() {
  // this.httpServer?.register(
  //   'post',
  //   '/signup',
  //   async (params: any, body: Input) => {
  //     const output = await this.signUp?.execute(body)
  //     return output
  //   },
  // )
  // this.httpServer?.register(
  //   'get',
  //   '/accounts/:accountId',
  //   async (params: any, body: any) => {
  //     const output = await this.getAccount?.execute(
  //       params.accountId as string,
  //     )
  //     return output
  //   },
  // )
  // }
}
