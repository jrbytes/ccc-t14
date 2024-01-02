import GetAccountAccountDAO from "./GetAccountAccountDAO"
import SignUpAccountDAO from "./SignUpAccountDAO"

export default interface AccountDAO extends SignUpAccountDAO, GetAccountAccountDAO {
  save(account: any): Promise<void> 
  getById(accountId: string): Promise<any> 
  getByEmail(accountId: string): Promise<any>
}