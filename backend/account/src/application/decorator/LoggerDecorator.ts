import type UseCase from '../usecase/UseCase'

export default class LoggerDecorator implements UseCase {
  name = 'LoggerDecorator'

  constructor(readonly useCase: UseCase) {}

  async execute(input: any): Promise<any> {
    console.log(this.useCase.name, input)
    return await this.useCase.execute(input)
  }
}
