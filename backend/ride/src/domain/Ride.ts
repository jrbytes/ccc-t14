import type Coordinate from './Coordinate'
import DistanceCalculator from './DistanceCalculator'
import { FareCalculatorFactory } from './FareCalculator'
import type Position from './Position'
import type RideStatus from './RideStatus'
import { RideStatusFactory } from './RideStatus'

export default class Ride {
  status: RideStatus

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private driverId: string,
    status: string,
    readonly date: Date,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    private fare: number = 0,
    private distance: number = 0,
    private lastPosition?: Coordinate,
  ) {
    this.status = RideStatusFactory.create(status, this)
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ): Ride {
    const rideId = crypto.randomUUID()
    const driverId = ''
    const status = 'requested'
    const date = new Date()
    return new Ride(
      rideId,
      passengerId,
      driverId,
      status,
      date,
      fromLat,
      fromLong,
      toLat,
      toLong,
    )
  }

  accept(driverId: string): void {
    this.driverId = driverId
    this.status.accept()
  }

  start(): void {
    this.status.start()
  }

  finish(): void {
    const fareCalculator = FareCalculatorFactory.create(this.date)
    this.fare = fareCalculator.calculate(this.distance)
    this.status.finish()
  }

  updatePosition(position: Position): void {
    if (this.lastPosition) {
      this.distance += DistanceCalculator.calculate(
        this.lastPosition,
        position.coordinate,
      )
    }
    this.lastPosition = position.coordinate
  }

  getStatus(): string {
    return this.status.value
  }

  getDriverId(): string {
    return this.driverId
  }

  getFare(): number {
    return this.fare
  }

  getDistance(): number {
    return this.distance
  }

  getLastPosition(): Coordinate | undefined {
    return this.lastPosition
  }
}
