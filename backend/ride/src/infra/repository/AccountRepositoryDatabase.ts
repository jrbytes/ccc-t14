import Account from '../../domain/Account'
import type AccountRepository from '../../application/repository/AccountRepository'
import type DatabaseConnection from '../../infra/database/DatabaseConnection'

export default class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(account: Account): Promise<void> {
    await this.connection.query(
      'insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)',
      [
        account.accountId,
        account.name.value,
        account.email.value,
        account.cpf.value,
        account.carPlate.value,
        !!account.isPassenger,
        !!account.isDriver,
      ],
    )
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const [account] = await this.connection.query('select * from cccat14.account where account_id = $1', [accountId])
    if (!account) {
      return undefined
    }
    return Account.restore(
      String(account.account_id),
      String(account.name),
      String(account.email),
      String(account.cpf),
      String(account.car_plate),
      Boolean(account.is_passenger),
      Boolean(account.is_driver),
    )
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const [account] = await this.connection.query('select * from cccat14.account where email = $1', [email])
    if (!account) return undefined
    return Account.restore(
      String(account.account_id),
      String(account.name),
      String(account.email),
      String(account.cpf),
      String(account.car_plate),
      Boolean(account.is_passenger),
      Boolean(account.is_driver),
    )
  }
}
