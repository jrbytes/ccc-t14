import sinon from "sinon";
import GetAccount from "../src/GetAccount";
import SignUp from "../src/SignUp";
import AccountDAODatabase from "../src/AccountDAODatabase";
import LoggerConsole from "../src/LoggerConsole";
import AccountDAO from "../src/AccountDAO";
import Logger from "../src/Logger";

let signup: SignUp;
let getAccount: GetAccount;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const logger = new LoggerConsole();
	signup = new SignUp(accountDAO, logger);
	getAccount = new GetAccount(accountDAO);
})

test("Deve criar uma conta para o passageiro com stub", async function () {
	const stubAccountDAOSave = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
	const stubAccountDAOGetByEmail = sinon.stub(AccountDAODatabase.prototype, "getByEmail").resolves(null);
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const stubAccountDAOGetById = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	stubAccountDAOSave.restore();
	stubAccountDAOGetByEmail.restore();
	stubAccountDAOGetById.restore();
});

test("Deve criar uma conta para o passageiro com mock", async function () {
	const mockLogger = sinon.mock(LoggerConsole.prototype);
	mockLogger.expects('log').withArgs('signup John Doe').once();
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	mockLogger.verify();
	mockLogger.restore();
});

test("Não deve criar uma conta se o nome for inválido", async function () {
	// given
	const inputSignup = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta se o email for inválido", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta se o cpf for inválido", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "11111111111",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta se o email for duplicado", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await signup.execute(inputSignup);
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
});

test("Deve criar uma conta para o motorista", async function () {
	const spyLoggerLog = sinon.spy(LoggerConsole.prototype, "log")
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(spyLoggerLog.calledOnce).toBeTruthy();
	expect(spyLoggerLog.calledWith(`signup ${inputSignup.name}`)).toBeTruthy();
	spyLoggerLog.restore();
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Deve criar uma conta para o passageiro com fake", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	const accounts: any = [];
	const accountDAO: AccountDAO = {
		async save (account: any): Promise<void> {
			accounts.push(account);
		},
		async getById (accountId: string): Promise<any> { 
			return accounts.find((account: any) => account.accountId === accountId);
		},
		async getByEmail (accountId: string): Promise<any> {
			return accounts.find((account: any) => account.email === accountId);
		}
	}
	const logger: Logger = {
		log (message: string): void {}
	}
	const signup = new SignUp(accountDAO, logger)
	const getAccount = new GetAccount(accountDAO);
	const outputSignup = await signup.execute(inputSignup);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
});