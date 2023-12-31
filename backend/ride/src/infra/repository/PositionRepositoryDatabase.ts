import type PositionRepository from '../../application/repository/PositionRepository'
import Coordinate from '../../domain/Coordinate'
import Position from '../../domain/Position'
import type DatabaseConnection from '../database/DatabaseConnection'

export default class PositionRepositoryDatabase implements PositionRepository {
  constructor(private readonly connection: DatabaseConnection) {}
  async save(position: Position): Promise<void> {
    await this.connection.query(
      'insert into cccat14.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
      [
        position.positionId,
        position.rideId,
        position.coordinate.lat,
        position.coordinate.long,
        position.date,
      ],
    )
  }

  async listByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query(
      'select * from cccat14.position where ride_id = $1 order by date',
      [rideId],
    )
    const positions: Position[] = []
    for (const positionData of positionsData) {
      positions.push(
        new Position(
          String(positionData.position_id),
          String(positionData.ride_id),
          new Coordinate(Number(positionData.lat), Number(positionData.long)),
          new Date(String(positionData.date)),
        ),
      )
    }
    return positions
  }
}
