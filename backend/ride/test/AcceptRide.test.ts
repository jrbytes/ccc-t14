import GetAccount from "../src/GetAccount";
import SignUp from "../src/SignUp";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import RideDAODatabase from "../src/RideDAODatabase";
import AcceptRide from "../src/AcceptRide";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";

let signup: SignUp;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

beforeEach(() => {
	const accountRepository = new AccountRepositoryDatabase();
	const rideDao = new RideDAODatabase();
	const logger = new LoggerConsole();
	signup = new SignUp(accountRepository, logger);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideDao, accountRepository, logger);
	getRide = new GetRide(rideDao, logger);
  acceptRide = new AcceptRide(rideDao, accountRepository);
})

test("Deve aceitar uma corrida", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -23.566236,
		fromLong: -46.650985,
		toLat: -23.566236,
		toLong: -46.650985
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
    carPlate: 'AAA9999',
		isDriver: true,
		password: "123456"
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    driverId: outputSignupDriver.accountId,
    rideId: outputRequestRide.rideId
  }
  await acceptRide.execute(inputAcceptRide);
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("accepted");
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId);
});

test("Não pode aceitar uma corrida se a conta for de um motorista", async function () {
	const inputSignupPassenger = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);
	const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		fromLat: -23.566236,
		fromLong: -46.650985,
		toLat: -23.566236,
		toLong: -46.650985
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    driverId: outputSignupDriver.accountId,
    rideId: outputRequestRide.rideId
  }
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Only drivers can accept a ride"));
});