import Cpf from '../src/domain/Cpf'

test.each(['97456321558', '71428793860', '87748248800'])('Deve testar cpf válidos', function (cpf: string) {
  expect(new Cpf(cpf)).toBeDefined()
})

test.each(['', '11111111111', '111', '11111111111111'])('Deve testar cpf inválidos', function (cpf: string) {
  expect(() => new Cpf(cpf)).toThrow(new Error('Invalid cpf'))
})
