export default class CarPlate {
  constructor(readonly value: string) {
    if (value && this.isInvalidCarPlate(value)) {
      throw new Error('Invalid car plate')
    }
  }

  private isInvalidCarPlate(carPlate: string): boolean {
    return !carPlate.match(/[A-Z]{3}[0-9]{4}/)
  }
}
