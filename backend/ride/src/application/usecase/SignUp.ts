import type Logger from '../logger/Logger'
import Account from '../../domain/Account'
import type AccountRepository from '../../application/repository/AccountRepository'

export default class SignUp {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly logger: Logger,
  ) {}

  async execute(input: Input): Promise<Output> {
    this.logger.log(`signup ${input.name}`)
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
