import type GetAccount from '../../application/usecase/GetAccount'
import type SignUp from '../../application/usecase/SignUp'
import { type Input } from '../../application/usecase/SignUp'
import { inject } from '../di/Registry'
import type HttpServer from '../http/HttpServer'

export default class MainController {
  @inject('httpServer')
  httpServer?: HttpServer

  @inject('signup')
  signUp?: SignUp

  @inject('getAccount')
  getAccount?: GetAccount

  constructor() {
    this.httpServer?.register(
      'post',
      '/signup',
      async (params: any, body: Input) => {
        const output = await this.signUp?.execute(body)
        return output
      },
    )

    this.httpServer?.register(
      'get',
      '/accounts/:accountId',
      async (params: any, body: any) => {
        try {
          const output = await this.getAccount?.execute(
            params.accountId as string,
          )
          return output
        } catch (error) {
          return undefined
        }
      },
    )
  }
}
