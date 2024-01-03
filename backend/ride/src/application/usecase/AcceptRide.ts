import type AccountRepository from '../../application/repository/AccountRepository'
import type RideRepository from '../../application/repository/RideRepository'

export default class AcceptRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute(input: any): Promise<void> {
    const account = await this.accountRepository.getById(input.driverId as string)
    if (account && !account.isDriver) {
      throw new Error('Only drivers can accept a ride')
    }
    const ride = await this.rideRepository.getById(input.rideId as string)
    if (!ride) throw new Error('Ride not found')
    ride.accept(input.driverId as string)
    await this.rideRepository.update(ride)
  }
}
