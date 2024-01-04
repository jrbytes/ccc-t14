export default class Transaction {
  private constructor(
    readonly transactionId: string,
    readonly rideId: string,
    readonly amount: number,
    readonly date: Date,
    public status: string,
  ) {}

  static create(rideId: string, amount: number): Transaction {
    const transactionId = crypto.randomUUID()
    const status = 'waiting_payment'
    const date = new Date()
    return new Transaction(transactionId, rideId, amount, date, status)
  }

  static restore(
    transactionId: string,
    rideId: string,
    amount: number,
    date: Date,
    status: string,
  ): Transaction {
    return new Transaction(transactionId, rideId, amount, date, status)
  }

  pay(): void {
    this.status = 'paid'
  }

  getStatus(): string {
    return this.status
  }
}
