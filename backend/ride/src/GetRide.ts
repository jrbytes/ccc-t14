import Logger from "./Logger";
import RideRepository from "./RideRepository";

export default class GetRide {
	constructor (private rideRepository: RideRepository, private logger: Logger) {}
	async execute(rideId: any): Promise<Output> {
		this.logger.log(`getRide`)
		const ride = await this.rideRepository.getById(rideId);
		if (!ride) throw new Error("Ride not found");
    return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId,
		};
	}
}

type Output = {
	rideId: string,
	status: string,
	driverId: string,
	passengerId: string,
}