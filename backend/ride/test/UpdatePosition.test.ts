import type AccountGateway from '../src/application/gateway/AccountGateway'
import AcceptRide from '../src/application/usecase/AcceptRide'
import GetRide from '../src/application/usecase/GetRide'
import RequestRide from '../src/application/usecase/RequestRide'
import StartRide from '../src/application/usecase/StartRide'
import UpdatePosition from '../src/application/usecase/UpdatePosition'
import PgPromiseAdapter from '../src/infra/database/PgPromiseAdapter'
import AccountGatewayHttp from '../src/infra/gateway/AccountGatewayHttp'
import AxiosAdapter from '../src/infra/http/AxiosAdapter'
import LoggerConsole from '../src/infra/logger/LoggerConsole'
import PositionRepositoryDatabase from '../src/infra/repository/PositionRepositoryDatabase'
import RideRepositoryDatabase from '../src/infra/repository/RideRepositoryDatabase'

let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let databaseConnection: PgPromiseAdapter
let updatePosition: UpdatePosition
let accountGateway: AccountGateway

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(databaseConnection)
  const positionRepository = new PositionRepositoryDatabase(databaseConnection)
  const logger = new LoggerConsole()
  accountGateway = new AccountGatewayHttp(new AxiosAdapter())
  requestRide = new RequestRide(rideRepository, accountGateway, logger)
  getRide = new GetRide(rideRepository, logger)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  startRide = new StartRide(rideRepository)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
})

test('Deve mudar a posição uma corrida', async function () {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  }
  const outputSignupPassenger =
    await accountGateway.signup(inputSignupPassenger)
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'AAA9999',
    isDriver: true,
    password: '123456',
  }
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  }
  await startRide.execute(inputStartRide)
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
  }
  await updatePosition.execute(inputUpdatePosition1)
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
  }
  await updatePosition.execute(inputUpdatePosition2)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('in_progress')
  expect(outputGetRide.distance).toBe(10)
})

afterEach(async () => {
  await databaseConnection.close()
})
