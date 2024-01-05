import type RideRepository from '../../application/repository/RideRepository'
import type Mediator from '../../infra/mediator/Mediator'

export default class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly mediator: Mediator,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() !== 'in_progress') {
      throw new Error('To update position ride must be in progress')
    }
    ride.finish()
    await this.rideRepository.update(ride)
    // await this.sendReceipt.execute({ rideId: ride.rideId })
    await this.mediator.publish('rideCompleted', {
      rideId: ride.rideId,
      amount: ride.getFare(),
    })
  }
}

interface Input {
  rideId: string
}
