import Coordinate from "./Coordinate"

export default class Position {
  constructor(readonly positionId: string, readonly rideId: string, readonly coordinate: Coordinate, readonly date: Date) {}

  static create (rideId: string, lat: number, long: number) {
    const positionId = crypto.randomUUID()
    const date = new Date()
    return new Position(positionId, rideId, new Coordinate(lat, long), date)
  }
}