const { MulterUploadService } = require('../MulterUploadService')
 
describe('MulterUploadService (regras de pasta e extensão — complementar)', () => {
  const makeService = () => new MulterUploadService()
 
 
  it('deve resolver pasta vazia quando a rota base não é users nem pets', () => {
    const service = makeService()
    expect(service.resolveFolder('/admins')).toBe('')
  })
 
  it('deve resolver pasta vazia quando baseUrl é string vazia', () => {
    const service = makeService()
    expect(service.resolveFolder('')).toBe('')
  })
 
  it('deve resolver pasta vazia quando baseUrl não é informado (default)', () => {
    const service = makeService()
    expect(service.resolveFolder()).toBe('')
  })
 
  it('deve resolver "users" mesmo com caminho mais longo contendo users', () => {
    const service = makeService()
    expect(service.resolveFolder('/v2/users/123')).toBe('users')
  })
 
  it('deve priorizar "users" quando aparece antes de pets no caminho', () => {
    const service = makeService()
    expect(service.resolveFolder('/users/pets')).toBe('users')
  })
 
 
  it('deve rejeitar arquivos jpeg (apenas jpg/png são aceitos)', () => {
    const service = makeService()
    expect(service.isAllowed('foto.jpeg')).toBe(false)
  })
 
  it('deve rejeitar extensão em maiúsculas (case-sensitive)', () => {
    const service = makeService()
    expect(service.isAllowed('foto.PNG')).toBe(false)
  })
 
  it('deve rejeitar arquivo sem extensão', () => {
    const service = makeService()
    expect(service.isAllowed('arquivo')).toBe(false)
  })
 
  it('deve rejeitar nome vazio (default do parâmetro)', () => {
    const service = makeService()
    expect(service.isAllowed()).toBe(false)
  })
 
  it('deve aceitar quando a extensão válida está no fim de um nome composto', () => {
    const service = makeService()
    expect(service.isAllowed('minha.foto.de.perfil.jpg')).toBe(true)
  })
 
  it('deve rejeitar quando png aparece no meio do nome, não como extensão', () => {
    const service = makeService()
    expect(service.isAllowed('png.documento.txt')).toBe(false)
  })
})