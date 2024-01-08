import type AccountGateway from '../src/application/gateway/AccountGateway'
import type PaymentGateway from '../src/application/gateway/PaymentGateway'
import GetRideQuery from '../src/application/query/GetRideQuery'
import AcceptRide from '../src/application/usecase/AcceptRide'
import FinishRide from '../src/application/usecase/FinishRide'
// import GetRideApiComposition from '../src/application/usecase/GetRideAPIComposition'
import RequestRide from '../src/application/usecase/RequestRide'
import StartRide from '../src/application/usecase/StartRide'
import UpdatePosition from '../src/application/usecase/UpdatePosition'
import { FareCalculatorFactory } from '../src/domain/FareCalculator'
import PgPromiseAdapter from '../src/infra/database/PgPromiseAdapter'
import AccountGatewayHttp from '../src/infra/gateway/AccountGatewayHttp'
import PaymentGatewayHttp from '../src/infra/gateway/PaymentGatewayHttp'
import LoggerConsole from '../src/infra/logger/LoggerConsole'
import Queue from '../src/infra/queue/Queue'
import PositionRepositoryDatabase from '../src/infra/repository/PositionRepositoryDatabase'
import RideRepositoryDatabase from '../src/infra/repository/RideRepositoryDatabase'

let requestRide: RequestRide
let getRide: GetRideQuery
let acceptRide: AcceptRide
let startRide: StartRide
let databaseConnection: PgPromiseAdapter
let updatePosition: UpdatePosition
let finishRide: FinishRide
let accountGateway: AccountGateway
let paymentGateway: PaymentGateway

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter()
  const rideRepository = new RideRepositoryDatabase(databaseConnection)
  const positionRepository = new PositionRepositoryDatabase(databaseConnection)
  const logger = new LoggerConsole()
  accountGateway = new AccountGatewayHttp()
  requestRide = new RequestRide(rideRepository, accountGateway, logger)
  getRide = new GetRideQuery(databaseConnection)
  // getRide = new GetRideApiComposition(rideRepository, accountGateway, logger)
  acceptRide = new AcceptRide(rideRepository, accountGateway)
  startRide = new StartRide(rideRepository)
  updatePosition = new UpdatePosition(rideRepository, positionRepository)
  paymentGateway = new PaymentGatewayHttp()
  // const queue: Queue = {
  //   async publish(queue: string, data: any): Promise<void> {},
  //   async consume(queue: string, callback: any): Promise<void> {},
  // }
  const queue = new Queue()
  finishRide = new FinishRide(rideRepository, paymentGateway, queue)
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
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  }
  await finishRide.execute(inputFinishRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('completed')
  const distance = outputGetRide.distance
  expect(distance).toBe(10)
  const fareCalculator = FareCalculatorFactory.create(new Date()).calculate(
    distance || 0,
  )
  expect(outputGetRide.fare).toBe(fareCalculator)
  expect(outputGetRide.passengerName).toBe('John Doe')
  expect(outputGetRide.passengerCpf).toBe('97456321558')
  expect(outputGetRide.driverCarPlate).toBe('AAA9999')
})

afterEach(async () => {
  await databaseConnection.close()
})
