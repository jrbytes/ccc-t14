import type RideRepository from '../../application/repository/RideRepository'
import type DomainEvent from '../../domain/event/DomainEvent'
import type Queue from '../../infra/queue/Queue'
import type PaymentGateway from '../gateway/PaymentGateway'

export default class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly paymentGateway: PaymentGateway,
    private readonly queue: Queue,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride not found')
    ride.register(async (event: DomainEvent) => {
      await this.queue.publish(event.name, event)
    })
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
