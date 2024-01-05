import axios from 'axios'

axios.defaults.validateStatus = () => true

test('Deve criar uma conta para o passageiro pela API', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '71428793860',
    isPassenger: true,
    password: '123456',
  }
  const responseSignUp = await axios.post(
    'http://localhost:3001/signup',
    inputSignup,
  )
  const outputSignup = responseSignUp.data
  const responseGetAccount = await axios.get(
    `http://localhost:3001/accounts/${outputSignup.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data
  expect(outputSignup.accountId).toBeDefined()
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
})

test('Não deve criar uma conta se o nome for inválido', async function () {
  const inputSignup = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  }
  const response = await axios.post('http://localhost:3001/signup', inputSignup)
  expect(response.status).toBe(422)
  expect(response.data.message).toBe('Invalid name')
})

test('Deve criar uma conta para o motorista', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
    password: '123456',
  }
  const { data } = await axios.post('http://localhost:3001/signup', inputSignup)
  const responseGetAccount = await axios.get(
    `http://localhost:3001/accounts/${data.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data
  expect(outputGetAccount.name).toBe(inputSignup.name)
  expect(outputGetAccount.email).toBe(inputSignup.email)
})

test('Não deve criar uma conta para o motorista com a placa inválida', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'AAA999',
    isPassenger: false,
    isDriver: true,
    password: '123456',
  }
  const response = await axios.post('http://localhost:3001/signup', inputSignup)
  expect(response.status).toBe(422)
  expect(response.data.message).toBe('Invalid car plate')
})
