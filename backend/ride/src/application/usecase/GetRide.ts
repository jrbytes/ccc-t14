import Logger from "../logger/Logger";
import RideRepository from "../../application/repository/RideRepository";
import PositionRepository from "../repository/PositionRepository";
import DistanceCalculator from "../../domain/DistanceCalculator";

export default class GetRide {
	constructor (private rideRepository: RideRepository, private positionRepository: PositionRepository, private logger: Logger) {}
	async execute(rideId: any): Promise<Output> {
		this.logger.log(`getRide`)
		const ride = await this.rideRepository.getById(rideId);
		if (!ride) throw new Error("Ride not found");
		const positions = await this.positionRepository.listByRideId(rideId);
		let distance = 0;
		for (const [index, position] of positions.entries()) {
			if (!positions[index + 1]) break;
			const from = { lat: position.coordinate.lat, long: position.coordinate.long };
			const to = { lat: positions[index + 1].coordinate.lat, long: positions[index + 1].coordinate.long };
			distance += DistanceCalculator.calculate(from, to)
		}
    return {
			rideId: ride.rideId,
			status: ride.getStatus(),
			driverId: ride.getDriverId(),
			passengerId: ride.passengerId,
			distance,
			fare: ride.getFare()
		};
	}
}

type Output = {
	rideId: string,
	status: string,
	driverId: string,
	passengerId: string,
	distance?: number
	fare?: number
}