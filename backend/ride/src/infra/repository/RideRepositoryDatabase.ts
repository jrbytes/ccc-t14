import type RideRepository from '../../application/repository/RideRepository'
import Coordinate from '../../domain/Coordinate'
import Ride from '../../domain/Ride'
import type DatabaseConnection from '../database/DatabaseConnection'

export default class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(ride: Ride): Promise<void> {
    await this.connection.query(
      'insert into cccat14.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, fare, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
        ride.getFare(),
        ride.getDistance(),
      ],
    )
  }

  async update(ride: Ride): Promise<void> {
    await this.connection.query(
      'update cccat14.ride set status = $1, driver_id = $2, distance = $3, fare = $4, last_lat = $5, last_long = $6 where ride_id = $7',
      [
        ride.getStatus(),
        ride.getDriverId(),
        ride.getDistance(),
        ride.getFare(),
        ride.getLastPosition()?.lat,
        ride.getLastPosition()?.long,
        ride.rideId,
      ],
    )
  }

  async getById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.connection.query(
      'select * from cccat14.ride where ride_id = $1',
      [rideId],
    )
    if (!ride) return undefined
    let lastPosition: Coordinate | undefined
    if (ride.last_lat && ride.last_long) {
      lastPosition = new Coordinate(
        Number(ride.last_lat),
        Number(ride.last_long),
      )
    }
    return new Ride(
      String(ride.ride_id),
      String(ride.passenger_id),
      String(ride.driver_id),
      String(ride.status),
      new Date(String(ride.date)),
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
      Number(ride.fare),
      Number(ride.distance),
      lastPosition,
    )
  }

  async list(): Promise<Ride[]> {
    const ridesData = await this.connection.query(
      'select * from cccat14.ride',
      [],
    )
    const rides: Ride[] = []
    for (const ride of ridesData) {
      rides.push(
        new Ride(
          String(ride.ride_id),
          String(ride.passenger_id),
          String(ride.driver_id),
          String(ride.status),
          new Date(String(ride.date)),
          Number(ride.from_lat),
          Number(ride.from_long),
          Number(ride.to_lat),
          Number(ride.to_long),
        ),
      )
    }
    return rides
  }

  async getActiveRideByPassengerId(
    passengerId: string,
  ): Promise<Ride | undefined> {
    const [ride] = await this.connection.query(
      "select * from cccat14.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
      [passengerId],
    )
    if (!ride) return undefined
    return new Ride(
      String(ride.ride_id),
      String(ride.passenger_id),
      String(ride.driver_id),
      String(ride.status),
      new Date(String(ride.date)),
      Number(ride.from_lat),
      Number(ride.from_long),
      Number(ride.to_lat),
      Number(ride.to_long),
    )
  }
}
