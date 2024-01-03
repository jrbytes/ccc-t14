import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase'
import ExpressAdapter from './infra/http/ExpressAdapter'
import GetAccount from './application/usecase/GetAccount'
import LoggerConsole from './infra/logger/LoggerConsole'
import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import SignUp from './application/usecase/SignUp'

const httpServer = new ExpressAdapter()
const databaseConnection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(databaseConnection)
const logger = new LoggerConsole()
const signUp = new SignUp(accountRepository, logger)
const getAccount = new GetAccount(accountRepository)
// eslint-disable-next-line no-new
new MainController(httpServer, signUp, getAccount)
httpServer.listen(3000)
