import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import Registry from './infra/di/Registry'
import ExpressAdapter from './infra/http/ExpressAdapter'
import LoggerConsole from './infra/logger/LoggerConsole'

const httpServer = new ExpressAdapter()
const databaseConnection = new PgPromiseAdapter()
const logger = new LoggerConsole()
const registry = Registry.getInstance()
registry.register('httpServer', httpServer)
new MainController()
httpServer.listen(3000)
