const { InputSanitizer } = require('../InputSanitizer')

describe('InputSanitizer (aprimoramento de segurança)', () => {
  it('deve remover tags HTML/script dos valores de texto', () => {
    const input = { name: 'Maria<script>alert(1)</script>', email: 'm@m.com' }
    const output = InputSanitizer.sanitize(input)

    expect(output.name).toBe('Maria')
    expect(output.email).toBe('m@m.com')
  })

    it('deve remover espaços nas pontas (trim)', () => {
    const output = InputSanitizer.sanitize({ name: '  Maria  ' })
    expect(output.name).toBe('Maria')
  })

  it('deve manter apenas os campos permitidos (whitelist de payload)', () => {
    const input = {
      name: 'Maria',
      email: 'm@m.com',
      phone: '11999999999',
      password: '123456',
      confirmpassword: '123456',
      isAdmin: true, // campo malicioso tentando escalar privilégio
      role: 'superuser',
    }
    const output = InputSanitizer.pick(input, [
      'name',
      'email',
      'phone',
      'password',
      'confirmpassword',
    ])

     expect(output).not.toHaveProperty('isAdmin')
    expect(output).not.toHaveProperty('role')
    expect(output).toHaveProperty('name')
    expect(output).toHaveProperty('email')
  })

  it('não deve quebrar com valores não-string (números, undefined)', () => {
    const output = InputSanitizer.sanitize({ age: 5, missing: undefined })
    expect(output.age).toBe(5)
    expect(output.missing).toBeUndefined()
  })
})