import RideDAO from "./RideDAO";

export default class StartRide {
	constructor (private rideDAO: RideDAO) {}
	async execute(input: any) {
		const ride = await this.rideDAO.getById(input.rideId);
		console.log('debug', ride)
		Object.assign(ride, { status: "in_progress" });
		await this.rideDAO.update(ride);
	}
}
