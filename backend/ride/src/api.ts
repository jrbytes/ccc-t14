import express, { Request, Response } from "express";
import GetAccount from "./GetAccount";
import SignUp from "./SignUp";
import LoggerConsole from "./LoggerConsole";
import AccountRepositoryDatabase from "./AccountRepositoryDatabase";

const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request, res: Response) {
	try {
		const input = req.body;
		const accountDAO = new AccountRepositoryDatabase();
		const logger = new LoggerConsole();
		const signUp = new SignUp(accountDAO, logger);
		const output = await signUp.execute(input);
		res.json(output)
	} catch (error: any) {
		res.status(422).json({ message: error.message })
	}
});

app.get("/accounts/:accountId", async function (req: Request, res: Response) {
	const accountId = req.params.accountId;
	const accountDAO = new AccountRepositoryDatabase();
	const getAccount = new GetAccount(accountDAO);
	const output = await getAccount.execute(accountId);
	res.json(output)
});

app.listen(3000)