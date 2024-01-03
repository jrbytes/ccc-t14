import RideRepository from "../../application/repository/RideRepository";
import DistanceCalculator from "../../domain/DistanceCalculator";
import PositionRepository from "../repository/PositionRepository";

export default class FinishRide {
	constructor (private rideRepository: RideRepository, private positionRepository: PositionRepository) {}
	async execute(input: Input) {
		const ride = await this.rideRepository.getById(input.rideId)
		if (!ride) throw new Error("Ride not found")
		if (ride.getStatus() !== "in_progress") throw new Error("To update position ride must be in progress")
		const positions = await this.positionRepository.listByRideId(input.rideId)
		let distance = 0
		for (const [index, position] of positions.entries()) {
			if (!positions[index + 1]) break
			const from = { lat: position.coordinate.lat, long: position.coordinate.long }
			const to = { lat: positions[index + 1].coordinate.lat, long: positions[index + 1].coordinate.long }
			distance += DistanceCalculator.calculate(from, to)
		}
		ride.finish(distance);
		await this.rideRepository.update(ride);
	}
}

type Input = {
	rideId: string,
}
