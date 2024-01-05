import type RideRepository from '../../application/repository/RideRepository'
import type PaymentGateway from '../gateway/PaymentGateway'

export default class FinishRide {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() !== 'in_progress') {
      throw new Error('To update position ride must be in progress')
    }
    ride.finish()
    await this.rideRepository.update(ride)
    await this.paymentGateway.processPayment({
      rideId: ride.rideId,
      amount: ride.getFare(),
    })
  }
}

interface Input {
  rideId: string
}
