import type RideCompletedEvent from '../../domain/event/RideCompletedEvent'
import type DatabaseConnection from '../../infra/database/DatabaseConnection'
import type AccountGateway from '../gateway/AccountGateway'

export default class UpdateRideProjectionAPIComposition {
  constructor(
    readonly connection: DatabaseConnection,
    readonly accountGateway: AccountGateway,
  ) {}

  async execute(input: RideCompletedEvent): Promise<void> {
    const [rideData] = await this.connection.query(
      `
      SELECT
        r.ride_id,
        r.fare,
        r.distance,
        r.status,
        r.passenger_id,
        r.driver_id
      FROM
        cccat14.ride r
      WHERE
        r.ride_id = $1;
      `,
      [input.rideId],
    )
    const passenger = await this.accountGateway.getById(
      rideData.passenger_id as string,
    )
    let driver: any
    if (rideData.driver_id) {
      driver = await this.accountGateway.getById(rideData.driver_id as string)
    }
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
        passenger.name,
        passenger.cpf,
        driver.name,
        driver.cpf,
        driver.carPlate,
      ],
    )
  }
}
