const { Adoption } = require('../Adoption')

describe('Entidade Adoption (regras de agendamento e conclusão)', () => {
  const owner = { _id: 'owner-1', name: 'Dona Ana', phone: '11999' }
  const visitor = { _id: 'visitor-1', name: 'João' }

  const makePet = (overrides = {}) => ({
    _id: 'pet-1',
    available: true,
    user: owner,
    adopter: null,
    ...overrides,
  })

  it('deve agendar uma visita válida e registrar o adotante', () => {
    const adoption = new Adoption(makePet())
    adoption.schedule(visitor)

    expect(adoption.pet.adopter._id).toBe('visitor-1')
    expect(adoption.pet.adopter.name).toBe('João')
  })

  it('não deve permitir que o dono agende visita com o próprio pet', () => {
    const adoption = new Adoption(makePet())
    expect(() => adoption.schedule(owner))
      .toThrow('Você não pode agendar uma visita com seu próprio Pet!')
  })

  it('não deve permitir agendar duas vezes o mesmo adotante', () => {
    const adoption = new Adoption(makePet({ adopter: visitor }))
    expect(() => adoption.schedule(visitor))
      .toThrow('Você já agendou uma visita para este Pet!')
  })

  it('deve permitir um adotante diferente agendar mesmo havendo outro adotante', () => {
    const outroVisitante = { _id: 'visitor-2', name: 'Maria' }
    const adoption = new Adoption(makePet({ adopter: visitor }))
    adoption.schedule(outroVisitante)
    expect(adoption.pet.adopter._id).toBe('visitor-2')
  })

  it('deve concluir a adoção tornando o pet indisponível', () => {
    const adoption = new Adoption(makePet({ adopter: visitor }))
    adoption.conclude()
    expect(adoption.pet.available).toBe(false)
  })

  it('não deve concluir uma adoção sem adotante agendado', () => {
    const adoption = new Adoption(makePet({ adopter: null }))
    expect(() => adoption.conclude())
      .toThrow('Não é possível concluir uma adoção sem um adotante!')
  })

  it('deve lançar erro ao iniciar adoção sem pet', () => {
    expect(() => new Adoption(undefined))
      .toThrow('O pet é obrigatório para iniciar uma adoção!')
  })


  it('deve comparar ids via .equals quando o id é um ObjectId-like', () => {
    const ownerObjId = {
      _id: { equals: (other) => other === 'owner-1' },
      name: 'Dona Ana',
    }
    const adoption = new Adoption(makePet({ user: ownerObjId }))
    expect(() => adoption.schedule({ _id: 'owner-1', name: 'Dona Ana' }))
      .toThrow('Você não pode agendar uma visita com seu próprio Pet!')
  })
})