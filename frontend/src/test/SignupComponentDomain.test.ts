import SignupComponentDomain from '@/domain/SignupComponentDomain'
import { expect, test} from 'vitest'

test('Deve testar o fluxo do wizard', async () => {
  const signupComponent = new SignupComponentDomain()
  signupComponent.isPassenger = true
  const name = 'John Doe'
  const email = `john.doe${Math.random()}@gmail.com`
  const cpf = '97812387689'
  const carPlate = 'ABC-1234'
  expect(signupComponent.step).toBe(1)
  expect(signupComponent.isPreviousButtonVisible()).toBeFalsy()
  signupComponent.next()
  expect(signupComponent.step).toBe(2)
  signupComponent.name = name
  signupComponent.email = email
  signupComponent.cpf = cpf
  signupComponent.isDriver = true
  signupComponent.carPlate = carPlate
  signupComponent.next()
  expect(signupComponent.step).toBe(3)
  expect(signupComponent.isNextButtonVisible()).toBeFalsy()
  signupComponent.previous()
  expect(signupComponent.step).toBe(2)
  signupComponent.previous()
  expect(signupComponent.step).toBe(1)
})

test('Nao deve ir para o passo 2 se pelo menos uma opcao (passenger ou driver) nao estiver marcada', async () => {
  const signupComponent = new SignupComponentDomain()
  expect(signupComponent.step).toBe(1)
  signupComponent.next()
  expect(signupComponent.error).toBe("Select at least one option")
  signupComponent.isPassenger = true
  signupComponent.next()
  expect(signupComponent.error).toBe("")
})

test('Nao deve ir para o passo 3 se os campos nome, email e cpf placa do carro nao estiver preenchido, se for motorista', async () => {
  const signupComponent = new SignupComponentDomain()
  const name = 'John Doe'
  const email = `john.doe${Math.random()}@gmail.com`
  const cpf = '97812387689'
  const carPlate = 'ABC-1234'
  expect(signupComponent.step).toBe(1)
  signupComponent.isPassenger = true
  signupComponent.isDriver = true
  expect(signupComponent.isPreviousButtonVisible()).toBeFalsy()
  signupComponent.next()
  expect(signupComponent.step).toBe(2)
  signupComponent.name = ""
  signupComponent.email = ""
  signupComponent.cpf = ""
  signupComponent.next()
  expect(signupComponent.error).toBe("Invalid name")
  signupComponent.name = name
  signupComponent.next()
  expect(signupComponent.error).toBe("Invalid email")
  signupComponent.email = email
  signupComponent.next()
  expect(signupComponent.error).toBe("Invalid cpf")
  signupComponent.cpf = cpf
  signupComponent.next()
  expect(signupComponent.error).toBe("Invalid car plate")
  signupComponent.carPlate = carPlate
  signupComponent.next()
  expect(signupComponent.error).toBe("")
  expect(signupComponent.step).toBe(3)
})