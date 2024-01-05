import type TransactionRepository from '../../application/repository/TransactionRepository'
import type Transaction from '../../domain/Transaction'
import type DatabaseConnection from '../database/DatabaseConnection'
import ORM from '../orm/ORM'
import TransactionModel from '../orm/TransactionModel'

export default class TransactionRepositoryORM implements TransactionRepository {
  orm: ORM

  constructor(readonly connection: DatabaseConnection) {
    this.orm = new ORM(connection)
  }

  async save(transaction: Transaction): Promise<void> {
    const transactionModel = new TransactionModel(
      transaction.transactionId,
      transaction.rideId,
      transaction.amount,
      transaction.date,
      transaction.status,
    )
    await this.orm.save(transactionModel)
  }

  async getByRideId(rideId: string): Promise<any> {
    const transactionModel = await this.orm.get(
      TransactionModel,
      'ride_id',
      rideId,
    )
    return transactionModel
  }
}
