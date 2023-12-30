import express, { Request, Response } from "express";
import GetAccount from "./GetAccount";
import SignUp from "./SignUp";

const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request, res: Response) {
	try {
		const input = req.body;
		const signUp = new SignUp();
		const output = await signUp.execute(input);
		res.json(output)
	} catch (error: any) {
		res.status(422).json({ message: error.message })
	}
});

app.get("/accounts/:accountId", async function (req: Request, res: Response) {
	const accountId = req.params.accountId;
	const getAccount = new GetAccount();
	const output = await getAccount.execute(accountId);
	res.json(output)
});

app.listen(3000)