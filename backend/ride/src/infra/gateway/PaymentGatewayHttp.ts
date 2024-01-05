import axios from 'axios'

import type PaymentGateway from '../../application/gateway/PaymentGateway'

export default class PaymentGatewayHttp implements PaymentGateway {
  async processPayment(input: any): Promise<any> {
    await axios.post('http://localhost:3002/process_payment', input)
  }
}
