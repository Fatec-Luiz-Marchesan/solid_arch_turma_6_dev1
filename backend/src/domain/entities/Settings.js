const VALID_THEMES = ['light', 'dark']
const VALID_LANGUAGES = ['pt-BR', 'en-US', 'es']

class Settings {
  constructor({ id, userId, theme, language, notificationsEnabled }) {
    if (!userId) {
      throw new Error('O usuário das configurações é obrigatório!')
    }

    const finalTheme = theme || 'light'
    if (!VALID_THEMES.includes(finalTheme)) {
      throw new Error('Tema inválido!')
    }

    const finalLanguage = language || 'pt-BR'
    if (!VALID_LANGUAGES.includes(finalLanguage)) {
      throw new Error('Idioma inválido!')
    }

    if (
      notificationsEnabled !== undefined &&
      typeof notificationsEnabled !== 'boolean'
    ) {
      throw new Error('O campo de notificações deve ser booleano!')
    }

    this.id = id
    this.userId = userId
    this.theme = finalTheme
    this.language = finalLanguage
    this.notificationsEnabled =
      notificationsEnabled === undefined ? true : notificationsEnabled
  }
}

module.exports = { Settings, VALID_THEMES, VALID_LANGUAGES }