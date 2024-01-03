import AcceptRide from "../src/application/usecase/AcceptRide";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import SignUp from "../src/application/usecase/SignUp";
import PgPromiseAdapter from "../src/infra/database/PgPromiseAdapter";
import LoggerConsole from "../src/infra/logger/LoggerConsole";
import AccountRepositoryDatabase from "../src/infra/repository/AccountRepositoryDatabase";
import PositionRepositoryDatabase from "../src/infra/repository/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../src/infra/repository/RideRepositoryDatabase";

let signup: SignUp;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let databaseConnection: PgPromiseAdapter;

beforeEach(() => {
	databaseConnection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(databaseConnection);
	const rideRepository = new RideRepositoryDatabase(databaseConnection);
	const positionRepository = new PositionRepositoryDatabase(databaseConnection);
	const logger = new LoggerConsole();
	signup = new SignUp(accountRepository, logger);
	getAccount = new GetAccount(accountRepository);
	requestRide = new RequestRide(rideRepository, accountRepository, logger);
	getRide = new GetRide(rideRepository, positionRepository, logger);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
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
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
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

afterEach(async () => {
	await databaseConnection.close();
})