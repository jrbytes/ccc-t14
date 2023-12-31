import GetAccount from "../src/GetAccount";
import SignUp from "../src/SignUp";
import AccountDAODatabase from "../src/AccountDAODatabase";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import RideDAODatabase from "../src/RideDAODatabase";

let signup: SignUp;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const rideDao = new RideDAODatabase();
	const logger = new LoggerConsole();
	signup = new SignUp(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDao, logger);
	getRide = new GetRide(rideDao, logger);
})

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -23.566236,
		fromLong: -46.650985,
		toLat: -23.566236,
		toLong: -46.650985
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	console.log(outputGetRide);
});
