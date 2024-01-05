import GetTransactionByRideId from './application/usecase/GetTransactionByRideId'
import ProcessPayment from './application/usecase/ProcessPayment'
import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import Registry from './infra/di/Registry'
import ExpressAdapter from './infra/http/ExpressAdapter'
import TransactionRepositoryORM from './infra/repository/TransactionRepositoryORM'

const httpServer = new ExpressAdapter()
const databaseConnection = new PgPromiseAdapter()

const transactionRepository = new TransactionRepositoryORM(databaseConnection)
const processPayment = new ProcessPayment(transactionRepository)
const getTransactionByRideId = new GetTransactionByRideId(transactionRepository)

const registry = Registry.getInstance()
registry.register('httpServer', httpServer)
registry.register('processPayment', processPayment)
registry.register('getTransactionByRideId', getTransactionByRideId)

new MainController()
httpServer.listen(3002)
