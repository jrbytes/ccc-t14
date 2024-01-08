import type AccountGateway from '../../application/gateway/AccountGateway'
import type HttpClient from '../http/HttpClient'

export default class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  async signup(input: any): Promise<any> {
    const response = await this.httpClient.post(
      'http://localhost:3001/signup',
      input,
    )
    return response
  }

  async getById(accountId: string): Promise<any> {
    const response = await this.httpClient.get(
      `http://localhost:3001/accounts/${accountId}`,
    )
    if (response.status === 422) {
      throw new Error(response.data.message as string)
    }
    return response
  }
}
