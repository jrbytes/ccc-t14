import type RideCompletedEvent from '../../domain/event/RideCompletedEvent'
import type DatabaseConnection from '../../infra/database/DatabaseConnection'

export default class UpdateRideProjection {
  constructor(readonly connection: DatabaseConnection) {}

  async execute(input: RideCompletedEvent): Promise<void> {
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
        ad.name AS driver_name,
        ad.cpf AS driver_cpf,
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
      [input.rideId],
    )
    await this.connection.query(
      `
      INSERT INTO
        cccat14.ride_projection (
          ride_id,
          passenger_id,
          driver_id,
          fare,
          distance,
          status,
          passenger_name,
          passenger_cpf,
          driver_name,
          driver_cpf,
          driver_car_plate
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
    `,
      [
        rideData.ride_id,
        rideData.passenger_id,
        rideData.driver_id,
        Number(rideData.fare),
        Number(rideData.distance),
        rideData.status,
        rideData.passenger_name,
        rideData.passenger_cpf,
        rideData.driver_name,
        rideData.driver_cpf,
        rideData.driver_car_plate,
      ],
    )
  }
}
