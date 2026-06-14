const { CreateEvent } = require('../CreateEvent')

describe('CreateEvent Use Case', () => {
    const makeEventRepository = () => ({
        create: jest.fn().mockImplementation(async (event) => ({
            id: 'event-id',
            ...event,
        })),
    })

    const makeClock = (nowIso) => ({
    now: jest.fn().mockReturnValue(new Date(nowIso)),
  })

  const makeSut = (nowIso = '2026-06-10T12:00:00Z') => {
    const eventRepository = makeEventRepository()
    const clock = makeClock(nowIso)
    const sut = new CreateEvent(eventRepository, clock)
    return { sut, eventRepository, clock }
  }

  const validInput = {
    title: 'Feira de adoção',
    startsAt: '2026-06-20T09:00:00Z',
    endsAt: '2026-06-20T17:00:00Z',
    organizerId: 'user-1',
  }

  it('deve lançar erro se o título não for informado', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, title: undefined }))
      .rejects.toThrow('O título do evento é obrigatório!')
  })

  it('deve lançar erro se a data de início for no passado', async () => {
    const { sut } = makeSut('2026-06-25T12:00:00Z')
    await expect(sut.execute(validInput))
      .rejects.toThrow('O evento não pode começar no passado!')
  })

  it('deve lançar erro se a data de fim for anterior à de início', async () => {
    const { sut } = makeSut()
    await expect(sut.execute({ ...validInput, endsAt: '2026-06-20T08:00:00Z' }))
      .rejects.toThrow('A data de término deve ser posterior à de início!')
  })

  it('deve criar o evento quando as datas são válidas', async () => {
    const { sut, eventRepository } = makeSut()
    const result = await sut.execute(validInput)

    expect(eventRepository.create).toHaveBeenCalledTimes(1)
    expect(result).toHaveProperty('id')
    expect(result.title).toBe('Feira de adoção')
  })
})