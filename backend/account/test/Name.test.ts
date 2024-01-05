import Name from '../src/domain/Name'

test.each(['João da Silva', 'John of the Forest', 'John Doe'])(
  'Deve testar um nome válido',
  function (name: string) {
    expect(new Name(name).value).toBe(name)
  },
)

test.each(['', 'João', 'João 1234', '1234 1234'])(
  'Deve testar um nome inválido',
  function (name: string) {
    expect(() => new Name(name)).toThrow(new Error('Invalid name'))
  },
)
