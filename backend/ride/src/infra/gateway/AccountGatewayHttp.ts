import axios from 'axios'

import type AccountGateway from '../../application/gateway/AccountGateway'

export default class AccountGatewayHttp implements AccountGateway {
  async signup(input: any): Promise<any> {
    const { data } = await axios.post('http://localhost:3001/signup', input)
    return data
  }

  async getById(accountId: string): Promise<any> {
    const { data } = await axios.get(
      `http://localhost:3001/accounts/${accountId}`,
    )
    return data
  }
}
