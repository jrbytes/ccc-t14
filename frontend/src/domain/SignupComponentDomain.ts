import Observable from "@/infra/Observable/Observable"

export default class SignupComponentDomain extends Observable {
  isPassenger = false
  isDriver = false
  name = ''
  email = ''
  cpf = ''
  carPlate = ''
  step = 1
  error = ''

  constructor() {
    super()
  }

  next(): void {
    this.error = ''
    if (this.step === 1 && !this.isPassenger && !this.isDriver) {
      this.error = 'Select at least one option'
      return
    }
    if (this.step === 2 && !this.name) {
      this.error = 'Invalid name'
      return
    }
    if (this.step === 2 && !this.email) {
      this.error = 'Invalid email'
      return
    }
    if (this.step === 2 && !this.cpf) {
      this.error = 'Invalid cpf'
      return
    }
    if (this.step === 2 && !this.carPlate && this.isDriver) {
      this.error = 'Invalid car plate'
      return
    }
    this.step++
  }

  previous(): void {
    this.step--
  }

  isPreviousButtonVisible(): boolean {
    const step = this.step
    return step > 1 && step < 4
  }

  isNextButtonVisible(): boolean {
    const step = this.step
    return step > 0 && step < 3
  }

  isSubmitButtonVisible(): boolean {
    return this.step === 3
  }

  submit(): void {
    this.next()
    const data = {
      isPassenger: this.isPassenger,
      isDriver: this.isDriver,
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      carPlate: this.carPlate
    }
    this.notify({ name: 'submitted', data })
  }

  populate() {
    this.name = 'John Doe'
    this.email = `john.doe${Math.random()}@gmail.com`
    this.cpf = '05153817563'
    this.carPlate = 'ABC1234'
  }
}