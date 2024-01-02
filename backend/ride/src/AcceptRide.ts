import AccountRepository from "./AccountRepository";
import RideDAO from "./RideDAO";

export default class AcceptRide {
	constructor (private rideDAO: RideDAO, private accountRepository: AccountRepository) {}
	async execute(input: any) {
		const account = await this.accountRepository.getById(input.driverId);
		if (account && !account.isDriver) {
			throw new Error("Only drivers can accept a ride");
		}
		const ride = await this.rideDAO.getById(input.rideId);
		ride.status = "accepted";
		ride.driverId = input.driverId;
		await this.rideDAO.update(ride);
	}
}
