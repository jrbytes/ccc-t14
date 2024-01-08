import type DatabaseConnection from '../../infra/database/DatabaseConnection'

export default class GetRideQuery {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(rideId: string): Promise<Output> {
    const [rideData] = await this.connection.query(
      `
      SELECT
        r.ride_id,
        r.fare,
        r.distance,
        r.status,
        r.passenger_id,
        r.driver_id,
        r.name AS passenger_name,
        r.cpf AS passenger_cpf,
        r.car_plate AS driver_car_plate
      FROM
        cccat14.ride_projection r
      WHERE
        r.ride_id = $1;
      `,
      [rideId],
    )
    return {
      rideId: rideData.ride_id,
      status: rideData.status,
      driverId: rideData.driver_id,
      passengerId: rideData.passenger_id,
      distance: Number(rideData.distance),
      fare: Number(rideData.fare),
      passengerName: rideData.passenger_name,
      passengerCpf: rideData.passenger_cpf,
      driverCarPlate: rideData.driver_car_plate,
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
