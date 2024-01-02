import GetAccount from "../src/GetAccount";
import SignUp from "../src/SignUp";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import GetRide from "../src/GetRide";
import AccountRepositoryDatabase from "../src/AccountRepositoryDatabase";
import RideRepositoryDatabase from "../src/RideRepositoryDatabase";
import PgPromiseAdapter from "../src/PgPromiseAdapter";

let signup: SignUp;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(databaseConnection);
	const rideRepoDd = new RideRepositoryDatabase();
	const logger = new LoggerConsole();
	signup = new SignUp(accountRepository, logger);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideRepoDd, accountRepository, logger);
	getRide = new GetRide(rideRepoDd, logger);
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
	expect(outputGetRide.status).toBe("requested");
});

test("Não deve solicitar uma corrida se a conta não existir", async function () {
	const inputRequestRide = {
		passengerId: "e133f5cc-7038-4838-bda0-a00fdf6ececa",
		fromLat: -23.566236,
		fromLong: -46.650985,
		toLat: -23.566236,
		toLong: -46.650985
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account does not exist"));
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		carPlate: 'AAA9999',
		isPassenger: false,
		isDriver: true,
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
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Only passengers can request a ride"));
});

test("Não deve solicitar uma corrida se o passageiro já estiver outra corrida ativa", async function () {
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
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Passenger has an active ride"));
});

afterEach(async () => {
	await databaseConnection.close();
})