import Transaction from '../../domain/Transaction'
import type Queue from '../../infra/queue/Queue'
import type TransactionRepository from '../repository/TransactionRepository'

export default class ProcessPayment {
  constructor(
    readonly transactionRepository: TransactionRepository,
    readonly queue: Queue,
  ) {}

  async execute(input: Input): Promise<void> {
    console.log('processPayment - not an instance', input)
    const transaction = Transaction.create(input.rideId, input.amount)
    transaction.pay()
    await this.transactionRepository.save(transaction)
    await this.queue.publish('paymentApproved', {
      transactionId: transaction.transactionId,
      rideId: input.rideId,
    })
  }
}

export interface Input {
  rideId: string
  creditCardToken: string
  amount: number
}
