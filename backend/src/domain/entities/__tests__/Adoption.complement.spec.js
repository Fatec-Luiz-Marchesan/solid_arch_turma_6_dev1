const { Adoption } = require('../Adoption')

describe('Entidade Adoption (cenários complementares)', () => {
  const owner = { _id: 'owner-1', name: 'Dona Ana', phone: '11999' }
  const visitor = { _id: 'visitor-1', name: 'João', image: 'joao.jpg' }

  const makePet = (overrides = {}) => ({
    _id: 'pet-1',
    available: true,
    user: owner,
    adopter: null,
    ...overrides,
  })

  it('schedule deve retornar o pet atualizado', () => {
    const adoption = new Adoption(makePet())
    const result = adoption.schedule(visitor)
    expect(result).toBe(adoption.pet)
    expect(result.adopter._id).toBe('visitor-1')
  })

  it('conclude deve retornar o pet atualizado', () => {
    const adoption = new Adoption(makePet({ adopter: visitor }))
    const result = adoption.conclude()
    expect(result).toBe(adoption.pet)
    expect(result.available).toBe(false)
  })

  it('deve registrar nome e imagem do adotante ao agendar', () => {
    const adoption = new Adoption(makePet())
    adoption.schedule(visitor)
    expect(adoption.pet.adopter.name).toBe('João')
    expect(adoption.pet.adopter.image).toBe('joao.jpg')
  })

  it('deve gravar image como undefined quando o visitante não tem imagem', () => {
    const semImagem = { _id: 'visitor-2', name: 'Maria' }
    const adoption = new Adoption(makePet())
    adoption.schedule(semImagem)
    expect(adoption.pet.adopter.image).toBeUndefined()
  })

  it('deve permitir agendar quando o visitante tem id diferente do dono (strings)', () => {
    const adoption = new Adoption(makePet())
    expect(() => adoption.schedule(visitor)).not.toThrow()
  })

  it('deve bloquear novo agendamento do mesmo adotante via ObjectId-like', () => {
    const adopterObj = {
      _id: { equals: (other) => other === 'visitor-1' },
      name: 'João',
    }
    const adoption = new Adoption(makePet({ adopter: adopterObj }))
    expect(() => adoption.schedule({ _id: 'visitor-1', name: 'João' }))
      .toThrow('Você já agendou uma visita para este Pet!')
  })

   it('deve concluir a adoção logo após um agendamento válido', () => {
    const adoption = new Adoption(makePet())
    adoption.schedule(visitor)
    const result = adoption.conclude()
    expect(result.available).toBe(false)
    expect(result.adopter._id).toBe('visitor-1')
  })


  it('deve sobrescrever o adotante quando outro visitante agenda', () => {
    const outro = { _id: 'visitor-9', name: 'Carla' }
    const adoption = new Adoption(makePet({ adopter: visitor }))
    adoption.schedule(outro)
    expect(adoption.pet.adopter._id).toBe('visitor-9')
    expect(adoption.pet.adopter.name).toBe('Carla')
  })

  it('deve iniciar a adoção com pet que ainda não tem adotante', () => {
    const adoption = new Adoption(makePet({ adopter: null }))
    expect(adoption.pet.adopter).toBeNull()
  })

  it('deve manter a referência ao mesmo pet passado no construtor', () => {
    const pet = makePet()
    const adoption = new Adoption(pet)
    expect(adoption.pet).toBe(pet)
  })
})