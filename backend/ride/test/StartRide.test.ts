import GetAccount from "../src/GetAccount";
import SignUp from "../src/SignUp";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import RideDAODatabase from "../src/RideDAODatabase";
import AcceptRide from "../src/AcceptRide";
import StartRide from "../src/StartRide";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";

let signup: SignUp;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(() => {
	const accountRepository = new AccountRepositoryDatabase();
	const rideDao = new RideDAODatabase();
	const logger = new LoggerConsole();
	signup = new SignUp(accountRepository, logger);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideDao, accountRepository, logger);
	getRide = new GetRide(rideDao, logger);
  acceptRide = new AcceptRide(rideDao, accountRepository);
	startRide = new StartRide(rideDao);
})

test("Deve iniciar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true,
		password: "123456"
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
	await acceptRide.execute(inputAcceptRide);
	const inputStartRide = {
		rideId: outputRequestRide.rideId
	};
	await startRide.execute(inputStartRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("in_progress");
});
