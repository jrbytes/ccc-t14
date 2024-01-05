import { Model, column, model } from './ORM'

@model('cccat14', 'transaction')
export default class TransactionModel extends Model {
  @column('transaction_id', true)
  transactionId: string

  @column('ride_id')
  rideId: string

  @column('amount')
  amount: number

  @column('status')
  status: string

  @column('date')
  date: Date

  constructor(
    transactionId: string,
    rideId: string,
    amount: number,
    date: Date,
    status: string,
  ) {
    super()
    this.transactionId = transactionId
    this.rideId = rideId
    this.amount = amount
    this.date = date
    this.status = status
  }
}
