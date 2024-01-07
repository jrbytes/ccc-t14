import axios from 'axios'

import GetRideByPassengerId from '../src/application/usecase/GetRideByPassengerId'
import PgPromiseAdapter from '../src/infra/database/PgPromiseAdapter'
import AccountGatewayHttp from '../src/infra/gateway/AccountGatewayHttp'
import RideRepositoryDatabase from '../src/infra/repository/RideRepositoryDatabase'

async function sleep(time: number): Promise<number> {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(time)
    }, time)
  })
}

let databaseConnection: PgPromiseAdapter
let accountGateway: AccountGatewayHttp
let getRideByPassengerId: GetRideByPassengerId

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter()
  accountGateway = new AccountGatewayHttp()
  const rideRepository = new RideRepositoryDatabase(databaseConnection)
  getRideByPassengerId = new GetRideByPassengerId(rideRepository)
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

  await axios.post('http://localhost:3000/request_ride_async', inputRequestRide)
  await sleep(200)
  const outputGetRide = await getRideByPassengerId.execute(
    outputSignup.accountId as string,
  )
  expect(outputGetRide.status).toBe('requested')
})

afterEach(async () => {
  await databaseConnection.close()
})
