import type RideRepository from '../repository/RideRepository'

export default class GetRideByPassengerId {
  constructor(private readonly rideRepository: RideRepository) {}

  async execute(passengerId: string): Promise<Output> {
    const ride =
      await this.rideRepository.getActiveRideByPassengerId(passengerId)
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
