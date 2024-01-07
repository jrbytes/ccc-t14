import GetAccount from './application/usecase/GetAccount'
import SignUp from './application/usecase/SignUp'
import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import Registry from './infra/di/Registry'
import ExpressAdapter from './infra/http/ExpressAdapter'
import LoggerConsole from './infra/logger/LoggerConsole'
import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase'

const httpServer = new ExpressAdapter()
const databaseConnection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(databaseConnection)
const logger = new LoggerConsole()
const signUp = new SignUp(accountRepository, logger)
const getAccount = new GetAccount(accountRepository)
const registry = Registry.getInstance()
registry.register('httpServer', httpServer)
registry.register('signup', signUp)
registry.register('getAccount', getAccount)
new MainController()
httpServer.listen(3004)
