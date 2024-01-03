import type GetAccount from '../../application/usecase/GetAccount'
import type SignUp from '../../application/usecase/SignUp'
import { type Input } from '../../application/usecase/SignUp'

export default class MainController {
  constructor(
    readonly httpServer: any,
    signUp: SignUp,
    getAccount: GetAccount,
  ) {
    httpServer.register('post', '/signup', async function (params: any, body: Input) {
      const output = await signUp.execute(body)
      return output
    })

    httpServer.register('get', '/accounts/:accountId', async function (params: any, body: any) {
      const output = await getAccount.execute(params.accountId as string)
      return output
    })
  }
}
