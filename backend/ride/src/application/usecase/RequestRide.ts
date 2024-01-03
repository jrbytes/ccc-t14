import type Logger from '../logger/Logger'
import type AccountRepository from '../../application/repository/AccountRepository'
import Ride from '../../domain/Ride'
import type RideRepository from '../../application/repository/RideRepository'

export default class RequestRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountRepository: AccountRepository,
    private readonly logger: Logger,
  ) {}

  async execute(input: Input): Promise<Output> {
    this.logger.log(`requestRide`)
    const account = await this.accountRepository.getById(input.passengerId)
    if (!account) {
      throw new Error('Account does not exist')
    }
    if (!account.isPassenger) {
      throw new Error('Only passengers can request a ride')
    }
    const activeRide = await this.rideRepository.getActiveRideByPassengerId(input.passengerId)
    if (activeRide) {
      throw new Error('Passenger has an active ride')
    }
    const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong)
    await this.rideRepository.save(ride)
    return {
      rideId: ride.rideId,
    }
  }
}

interface Input {
  passengerId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
}

interface Output {
  rideId: string
}
