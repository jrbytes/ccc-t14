import axios from 'axios'

// import GetRide from '../src/application/usecase/GetRide'
// import RequestRide from '../src/application/usecase/RequestRide'
import PgPromiseAdapter from '../src/infra/database/PgPromiseAdapter'
import AccountGatewayHttp from '../src/infra/gateway/AccountGatewayHttp'
// import LoggerConsole from '../src/infra/logger/LoggerConsole'
// import RideRepositoryDatabase from '../src/infra/repository/RideRepositoryDatabase'

// let requestRide: RequestRide
// let getRide: GetRide
let databaseConnection: PgPromiseAdapter
let accountGateway: AccountGatewayHttp

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter()
  // const rideRepoDd = new RideRepositoryDatabase(databaseConnection)
  // const logger = new LoggerConsole()
  accountGateway = new AccountGatewayHttp()
  // requestRide = new RequestRide(rideRepoDd, accountGateway, logger)
  // getRide = new GetRide(rideRepoDd, logger)
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
  // const outputRequestRide = await requestRide.execute(inputRequestRide)
  await axios.post('http://localhost:3000/request_ride_async', inputRequestRide)
  // const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  // expect(outputGetRide.status).toBe('requested')
})

afterEach(async () => {
  await databaseConnection.close()
})
