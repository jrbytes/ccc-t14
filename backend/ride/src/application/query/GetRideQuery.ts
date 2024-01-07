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
        ap.name AS passenger_name,
        ap.cpf AS passenger_cpf,
        ad.car_plate AS driver_car_plate
      FROM
        cccat14.ride r
      JOIN
        cccat14.account ap on ap.account_id = r.passenger_id
      LEFT JOIN
        cccat14.account ad on ad.account_id = r.driver_id
      WHERE
        r.ride_id = $1;
      `,
      [rideId],
    )
    console.log(rideData)
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
