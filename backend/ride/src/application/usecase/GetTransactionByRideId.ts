import type TransactionRepository from '../repository/TransactionRepository'

export default class GetTransactionByRideId {
  constructor(readonly transactionRepository: TransactionRepository) {}
  async execute(rideId: string): Promise<Output> {
    const transaction = await this.transactionRepository.getByRideId(rideId)
    return {
      transactionId: transaction.transactionId,
      rideId: transaction.transactionId,
      amount: transaction.amount,
      date: transaction.date,
      status: transaction.status,
    }
  }
}

interface Output {
  transactionId: string
  rideId: string
  amount: number
  date: Date
  status: string
}
