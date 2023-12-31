import AccountDAO from "./AccountDAO";

export default class GetAccount {
	constructor (private accountDAO: AccountDAO) {}
	async execute(accountId: string) {
		const account = await this.accountDAO.getById(accountId);
		return account;
	}
}
