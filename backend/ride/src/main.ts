import RequestRide from './application/usecase/RequestRide'
import UpdateRideProjectionAPIComposition from './application/usecase/UpdateRideProjectionAPIComposition'
import SendReceipt from './domain/SendReceipt'
import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import Registry from './infra/di/Registry'
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp'
import ExpressAdapter from './infra/http/ExpressAdapter'
import LoggerConsole from './infra/logger/LoggerConsole'
import Queue from './infra/queue/Queue'
import QueueController from './infra/queue/QueueController'
import RideRepositoryDatabase from './infra/repository/RideRepositoryDatabase'

const httpServer = new ExpressAdapter()
const queue = new Queue()
const sendReceipt = new SendReceipt()
const databaseConnection = new PgPromiseAdapter()
const rideRepository = new RideRepositoryDatabase(databaseConnection)
const accountGateway = new AccountGatewayHttp()
const logger = new LoggerConsole()
const requestRide = new RequestRide(rideRepository, accountGateway, logger)
const updateRideProjection = new UpdateRideProjectionAPIComposition(
  databaseConnection,
  accountGateway,
)

const registry = Registry.getInstance()
registry.register('httpServer', httpServer)
registry.register('queue', queue)
registry.register('sendReceipt', sendReceipt)
registry.register('requestRide', requestRide)
registry.register('updateRideProjection', updateRideProjection)

new MainController()
new QueueController()
httpServer.listen(3000)
