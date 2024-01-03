import type RideRepository from '../../application/repository/RideRepository'
import Position from '../../domain/Position'
import type PositionRepository from '../repository/PositionRepository'

export default class UpdatePosition {
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
    const position = Position.create(input.rideId, input.lat, input.long)
    await this.positionRepository.save(position)
    ride.updatePosition(position)
    await this.rideRepository.update(ride)
  }
}

interface Input {
  rideId: string
  lat: number
  long: number
}
