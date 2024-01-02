import AccountRepository from "../../application/repository/AccountRepository";
import RideRepository from "../../application/repository/RideRepository";

export default class AcceptRide {
	constructor (private rideRepository: RideRepository, private accountRepository: AccountRepository) {}
	async execute(input: any) {
		const account = await this.accountRepository.getById(input.driverId);
		if (account && !account.isDriver) {
			throw new Error("Only drivers can accept a ride");
		}
		const ride = await this.rideRepository.getById(input.rideId);
		if (!ride) throw new Error("Ride not found");
		ride.accept(input.driverId);
		await this.rideRepository.update(ride);
	}
}
