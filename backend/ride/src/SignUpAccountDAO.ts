export default interface SignUpAccountDAO {
  save(account: any): Promise<void> 
  getByEmail(accountId: string): Promise<any>
}