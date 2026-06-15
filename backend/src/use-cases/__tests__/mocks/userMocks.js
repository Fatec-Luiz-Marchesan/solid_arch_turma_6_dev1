function makeUserRepositoryMock(overrides = {}) {
  return {
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(async (user) => ({
      id: 'user-id',
      name: user.name,
      email: user.email,
      phone: user.phone,
    })),
    ...overrides,
  }
}

function makeHasherMock(hashed = 'hashed-password') {
  return {
    hash: jest.fn().mockResolvedValue(hashed),
    compare: jest.fn().mockResolvedValue(true),
  }
}

function makeTokenGeneratorMock(token = 'valid-token') {
  return {
    generate: jest.fn().mockReturnValue(token),
  }
}

module.exports = {
  makeUserRepositoryMock,
  makeHasherMock,
  makeTokenGeneratorMock,
}