import type RideRepository from '../../application/repository/RideRepository'
import type AccountGateway from '../gateway/AccountGateway'
import type Logger from '../logger/Logger'

export default class GetRideApiComposition {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly accountGateway: AccountGateway,
    private readonly logger: Logger,
  ) {}

  async execute(rideId: any): Promise<Output> {
    this.logger.log('getRideApiComposition')
    const ride = await this.rideRepository.getById(rideId as string)
    if (!ride) throw new Error('Ride not found')
    const passenger = await this.accountGateway.getById(ride.passengerId)
    let driver
    if (ride.getDriverId()) {
      driver = await this.accountGateway.getById(ride.getDriverId())
    }
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      distance: ride.getDistance(),
      fare: ride.getFare(),
      passengerName: passenger.name,
      passengerCpf: passenger.cpf,
      driverCarPlate: driver?.carPlate,
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
  passengerName: string
  passengerCpf: string
  driverCarPlate?: string
}
