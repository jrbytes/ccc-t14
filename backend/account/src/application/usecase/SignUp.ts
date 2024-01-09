import type AccountRepository from '../../application/repository/AccountRepository'
import Account from '../../domain/Account'
import type UseCase from './UseCase'

export default class SignUp implements UseCase {
  name = 'SignUp'

  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: Input): Promise<Output> {
    const existingAccount = await this.accountRepository.getByEmail(input.email)
    if (existingAccount) throw new Error('Duplicated account')
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate || '',
      !!input.isPassenger,
      !!input.isDriver,
    )
    await this.accountRepository.save(account)
    return {
      accountId: account.accountId,
    }
  }
}

export interface Input {
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger?: boolean
  isDriver?: boolean
  password: string
}

interface Output {
  accountId: string
}
