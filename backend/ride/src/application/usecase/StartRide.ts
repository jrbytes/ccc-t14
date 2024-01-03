import type RideRepository from '../../application/repository/RideRepository'

export default class StartRide {
  constructor(private readonly rideRepository: RideRepository) {}
  async execute(input: any): Promise<void> {
    const ride = await this.rideRepository.getById(input.rideId as string)
    if (!ride) throw new Error('Ride not found')
    ride.start()
    await this.rideRepository.update(ride)
  }
}
