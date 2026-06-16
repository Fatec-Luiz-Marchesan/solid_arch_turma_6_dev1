const BackupModel = require('../BackupModel')

describe('BackupModel (aprimoramento de seguranca)', () => {
  it('deve exigir os campos obrigatorios filename e triggeredBy', () => {
    const backup = new BackupModel({})
    const err = backup.validateSync()

    expect(err.errors.filename).toBeDefined()
    expect(err.errors.triggeredBy).toBeDefined()
  })

  it('deve aplicar status "pending" por padrao', () => {
    const backup = new BackupModel({
      filename: 'backup-2026-06-15.zip',
      triggeredBy: 'admin-id',
    })

    expect(backup.status).toBe('pending')
  })

  it('deve rejeitar status fora da lista permitida', () => {
    const backup = new BackupModel({
      filename: 'backup.zip',
      triggeredBy: 'admin-id',
      status: 'hackeado',
    })
    const err = backup.validateSync()

    expect(err.errors.status).toBeDefined()
  })

  it('deve rejeitar sizeInBytes negativo', () => {
    const backup = new BackupModel({
      filename: 'backup.zip',
      triggeredBy: 'admin-id',
      sizeInBytes: -100,
    })
    const err = backup.validateSync()

    expect(err.errors.sizeInBytes).toBeDefined()
  })

  it('deve remover espacos em branco do filename (trim)', () => {
    const backup = new BackupModel({
      filename: '  backup.zip  ',
      triggeredBy: 'admin-id',
    })

    expect(backup.filename).toBe('backup.zip')
  })

  it('deve rejeitar filename com caracteres de path perigosos', () => {
    const backup = new BackupModel({
      filename: '../../etc/passwd',
      triggeredBy: 'admin-id',
    })
    const err = backup.validateSync()

    expect(err.errors.filename).toBeDefined()
  })

  it('nao deve apresentar erro quando os dados sao validos', () => {
    const backup = new BackupModel({
      filename: 'backup-2026-06-15.zip',
      triggeredBy: 'admin-id',
      sizeInBytes: 2048,
      status: 'completed',
    })
    const err = backup.validateSync()

    expect(err).toBeUndefined()
  })
})
