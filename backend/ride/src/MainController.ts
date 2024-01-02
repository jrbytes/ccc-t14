import GetAccount from "./GetAccount";
import SignUp from "./SignUp";

export default class MainController {
  constructor(readonly httpServer: any, signUp: SignUp, getAccount: GetAccount) {
    httpServer.register('post', '/signup', async function (params: any, body: any) {
      const output = await signUp.execute(body);
      return output;
    })

    httpServer.register('get', '/accounts/:accountId', async function (params: any, body: any) {
      const output = await getAccount.execute(params.accountId);
      return output;
    })
  }
}