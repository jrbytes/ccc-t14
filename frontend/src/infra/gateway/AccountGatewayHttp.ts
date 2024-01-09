import type HttpClient from "../http/HttpClient";
import type AccountGateway from "./AccountGateway"

export default class AccountGatewayHttp implements AccountGateway {
  constructor(readonly httpClient: HttpClient) {}

  async signup(input: any): Promise<any> {
    const output = await this.httpClient.post('http://localhost:3001/signup', input)
    return output
  }
}