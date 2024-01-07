import GetTransactionByRideId from './application/usecase/GetTransactionByRideId'
import ProcessPayment from './application/usecase/ProcessPayment'
import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import Registry from './infra/di/Registry'
import ExpressAdapter from './infra/http/ExpressAdapter'
import Queue from './infra/queue/Queue'
import QueueController from './infra/queue/QueueController'
import TransactionRepositoryORM from './infra/repository/TransactionRepositoryORM'

const httpServer = new ExpressAdapter()
const databaseConnection = new PgPromiseAdapter()
const queue = new Queue()

const transactionRepository = new TransactionRepositoryORM(databaseConnection)
const processPayment = new ProcessPayment(transactionRepository, queue)
const getTransactionByRideId = new GetTransactionByRideId(transactionRepository)

const registry = Registry.getInstance()
registry.register('httpServer', httpServer)
registry.register('queue', queue)
registry.register('processPayment', processPayment)
registry.register('getTransactionByRideId', getTransactionByRideId)

new MainController()
new QueueController()
httpServer.listen(3002)
