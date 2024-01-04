import Transaction from '../src/domain/Transaction'

test('Deve verificar funções do transaction', function () {
  const account = Transaction.create('97456321558', 100)
  expect(account).toBeInstanceOf(Transaction)
  const restore = Transaction.restore(
    account.transactionId,
    account.rideId,
    account.amount,
    account.date,
    account.getStatus(),
  )
  expect(restore).toBeInstanceOf(Transaction)
  expect(restore.transactionId).toBe(account.transactionId)
  expect(restore.getStatus()).toBe('waiting_payment')
  restore.pay()
  expect(restore.getStatus()).toBe('paid')
})
