import type Logger from '../logger/Logger'
import type RideRepository from '../../application/repository/RideRepository'

export default class GetRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly logger: Logger,
  ) {}

  async execute(rideId: any): Promise<Output> {
    this.logger.log(`getRide`)
    const ride = await this.rideRepository.getById(rideId as string)
    if (!ride) throw new Error('Ride not found')
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      distance: ride.getDistance(),
      fare: ride.getFare(),
    }
  }
}

interface Output {
  rideId: string
  status: string
  driverId: string
  passengerId: string
  distance?: number
  fare?: number
}
