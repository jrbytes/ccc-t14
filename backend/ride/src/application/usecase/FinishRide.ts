import type RideRepository from '../../application/repository/RideRepository'
import type PositionRepository from '../repository/PositionRepository'

export default class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() !== 'in_progress') {
      throw new Error('To update position ride must be in progress')
    }
    ride.finish()
    await this.rideRepository.update(ride)
  }
}

interface Input {
  rideId: string
}
