import { test, expect, beforeEach } from "vitest"
import { mount } from '@vue/test-utils'
import AppVue from "@/App.vue"
import type AccountGateway from "@/infra/gateway/AccountGateway"

async function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

let wrapper: any

beforeEach(() => {
  const accountGateway: AccountGateway = {
    async signup(_input) {
      return {
        accountId: Math.random()
      }
    }
  }
  wrapper = mount(AppVue, {
    global: {
      provide: {
        accountGateway
      }
    }
  })
})

test('Deve testar o component de SignUp', async () => {
  const name = 'John Doe'
  const email = `john.doe${Math.random()}@gmail.com`
  const cpf = '05153817563'
  const carPlate = 'ABC1234'
  wrapper.get('#is-passenger').setValue(true)
  wrapper.get('#is-driver').setValue(true)
  await wrapper.get('#next-button').trigger('click')
  await wrapper.get('#input-name').setValue(name)
  await wrapper.get('#input-email').setValue(email)
  await wrapper.get('#input-cpf').setValue(cpf)
  await wrapper.get('#input-car-plate').setValue(carPlate)
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#name').text()).toBe(`Name: ${name}`)
  expect(wrapper.get('#email').text()).toBe(`Email: ${email}`)
  expect(wrapper.get('#cpf').text()).toBe(`Cpf: ${cpf}`)
  expect(wrapper.get('#car-plate').text()).toBe(`Car Plate: ${carPlate}`)
  await wrapper.get('#submit-button').trigger('click')
  await sleep(500)
  expect(wrapper.get('#account-id')).toBeDefined()
})

test('Deve testar o fluxo do wizard', async () => {
  const name = 'John Doe'
  const email = `john.doe${Math.random()}@gmail.com`
  const cpf = '97812387689'
  const carPlate = 'ABC-1234'
  expect(wrapper.get('#step').text()).toBe("Step 1")
  await wrapper.get('#is-passenger').setValue(true)
  expect(wrapper.find('#previous-button').exists()).toBeFalsy()
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#step').text()).toBe("Step 2")
  await wrapper.get('#input-name').setValue(name)
  await wrapper.get('#input-email').setValue(email)
  await wrapper.get('#input-cpf').setValue(cpf)
  expect(wrapper.find('#input-car-plate').exists()).toBeFalsy()
  await wrapper.get('#previous-button').trigger('click')
  await wrapper.get('#is-driver').setValue(true)
  await wrapper.get('#next-button').trigger('click')  
  await wrapper.get('#input-car-plate').setValue(carPlate)
  expect(wrapper.find('#input-car-plate').exists()).toBeTruthy()
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#step').text()).toBe("Step 3")
  expect(wrapper.find('#next-button').exists()).toBeFalsy()
  await wrapper.get('#previous-button').trigger('click')
  expect(wrapper.get('#step').text()).toBe("Step 2")
  await wrapper.get('#previous-button').trigger('click')
  expect(wrapper.get('#step').text()).toBe("Step 1")
})

test('Nao deve ir para o passo 2 se pelo menos uma opcao (passenger ou driver) nao estiver marcada', async () => {
  await wrapper.get('#next-button').trigger('click') 
  expect(wrapper.get('#step').text()).toBe("Step 1")
  expect(wrapper.get('#error').text()).toBe("Select at least one option")
  await wrapper.get('#is-passenger').setValue(true)
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#error').text()).toBe("")
})

test('Nao deve ir para o passo 3 se os campos nome, email e cpf placa do carro nao estiver preenchido, se for motorista', async () => {
  const name = 'John Doe'
  const email = `john.doe${Math.random()}@gmail.com`
  const cpf = '97812387689'
  const carPlate = 'ABC-1234'
  expect(wrapper.get('#step').text()).toBe("Step 1")
  wrapper.get('#is-passenger').setValue(true)
  wrapper.get('#is-driver').setValue(true)
  expect(wrapper.find('#previous-button').exists()).toBeFalsy()
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#step').text()).toBe("Step 2")
  await wrapper.get('#input-name').setValue("")
  await wrapper.get('#input-email').setValue("")
  await wrapper.get('#input-cpf').setValue("")
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#error').text()).toBe("Invalid name")
  await wrapper.get('#input-name').setValue(name)
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#error').text()).toBe("Invalid email")
  await wrapper.get('#input-email').setValue(email)
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#error').text()).toBe("Invalid cpf")
  await wrapper.get('#input-cpf').setValue(cpf)
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#error').text()).toBe("Invalid car plate")
  await wrapper.get('#input-car-plate').setValue(carPlate)
  await wrapper.get('#next-button').trigger('click')
  expect(wrapper.get('#error').text()).toBe("")
  expect(wrapper.get('#step').text()).toBe("Step 3")
})