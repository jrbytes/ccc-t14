import GetRide from '../src/application/usecase/GetRide'
import RequestRide from '../src/application/usecase/RequestRide'
import PgPromiseAdapter from '../src/infra/database/PgPromiseAdapter'
import AccountGatewayHttp from '../src/infra/gateway/AccountGatewayHttp'
import LoggerConsole from '../src/infra/logger/LoggerConsole'
import RideRepositoryDatabase from '../src/infra/repository/RideRepositoryDatabase'

let requestRide: RequestRide
let getRide: GetRide
let databaseConnection: PgPromiseAdapter
let accountGateway: AccountGatewayHttp

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter()
  const rideRepoDd = new RideRepositoryDatabase(databaseConnection)
  const logger = new LoggerConsole()
  accountGateway = new AccountGatewayHttp()
  requestRide = new RequestRide(rideRepoDd, accountGateway, logger)
  getRide = new GetRide(rideRepoDd, logger)
})

test('Deve solicitar uma corrida', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '71428793860',
    isPassenger: true,
    password: '123456',
  }
  const outputSignup = await accountGateway.signup(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.566236,
    fromLong: -46.650985,
    toLat: -23.566236,
    toLong: -46.650985,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('requested')
})

test('Não deve solicitar uma corrida se a conta não existir', async function () {
  const inputRequestRide = {
    passengerId: 'e133f5cc-7038-4838-bda0-a00fdf6ececa',
    fromLat: -23.566236,
    fromLong: -46.650985,
    toLat: -23.566236,
    toLong: -46.650985,
  }
  await expect(
    async () => await requestRide.execute(inputRequestRide),
  ).rejects.toThrow(new Error('Account does not exist'))
})

test('Não deve solicitar uma corrida se a conta não for de um passageiro', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '71428793860',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
    password: '123456',
  }
  const outputSignup = await accountGateway.signup(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.566236,
    fromLong: -46.650985,
    toLat: -23.566236,
    toLong: -46.650985,
  }
  await expect(
    async () => await requestRide.execute(inputRequestRide),
  ).rejects.toThrow(new Error('Only passengers can request a ride'))
})

test('Não deve solicitar uma corrida se o passageiro já estiver outra corrida ativa', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '71428793860',
    isPassenger: true,
    password: '123456',
  }
  const outputSignup = await accountGateway.signup(inputSignup)
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.566236,
    fromLong: -46.650985,
    toLat: -23.566236,
    toLong: -46.650985,
  }
  await requestRide.execute(inputRequestRide)
  await expect(
    async () => await requestRide.execute(inputRequestRide),
  ).rejects.toThrow(new Error('Passenger has an active ride'))
})

afterEach(async () => {
  await databaseConnection.close()
})
