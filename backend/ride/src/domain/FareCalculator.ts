export default interface FareCalculator {
  calculate: (distance: number) => number
}

export class NormalFareCalculator implements FareCalculator {
  FARE_NORMAL = 2.1
  calculate(distance: number): number {
    return distance * this.FARE_NORMAL
  }
}

export class OvernightFareCalculator implements FareCalculator {
  FARE_OVERNIGHT = 5
  calculate(distance: number): number {
    return distance * this.FARE_OVERNIGHT
  }
}

export class FareCalculatorFactory {
  static create(date: Date): FareCalculator {
    if (date.getHours() >= 8 && date.getHours() <= 22) {
      return new NormalFareCalculator()
    }
    return new OvernightFareCalculator()
  }
}
