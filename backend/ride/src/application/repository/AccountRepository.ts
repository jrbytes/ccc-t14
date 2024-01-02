import Account from "../../domain/Account"

export default interface AccountRepository {
  save(account: Account): Promise<void> 
  getById(accountId: string): Promise<Account | undefined>
  getByEmail(accountId: string): Promise<Account | undefined>
}