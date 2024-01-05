import axios from 'axios'

axios.defaults.validateStatus = () => true

test('Deve processar o pagamento', async () => {
  const rideId = crypto.randomUUID()
  const inputProcessPayment = {
    rideId,
    creditCardToken: '123456789',
    amount: 1000,
  }
  await axios.post('http://localhost:3002/process_payment', inputProcessPayment)
  const response = await axios.get(
    `http://localhost:3002/rides/${rideId}/transactions`,
  )
  const output = response.data
  // expect(output.rideId).toBe(rideId) falta verificar no orm
  expect(output.status).toBe('paid')
})
