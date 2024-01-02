import AccountRepositoryDatabase from "./AccountRepositoryDatabase";
import ExpressAdapter from "./ExpressAdapter";
import GetAccount from "./GetAccount";
import LoggerConsole from "./LoggerConsole";
import MainController from "./MainController";
import PgPromiseAdapter from "./PgPromiseAdapter";
import SignUp from "./SignUp";

const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const logger = new LoggerConsole();
const signUp = new SignUp(accountRepository, logger);
const getAccount = new GetAccount(accountRepository);
new MainController(httpServer, signUp, getAccount);
httpServer.listen(3000)