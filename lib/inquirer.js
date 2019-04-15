const inquirer = require('inquirer')

module.exports = {
  getThemeName: async () => {
    const questions = [
      {
        type: 'input',
        message: 'Provide an OctoberCMS theme name',
        name: 'themename',
      },
    ]

    return inquirer.prompt(questions)
  },
  getThemeDescr: async () => {
    const questions = [
      {
        type: 'input',
        message: 'Provide an OctoberCMS theme description',
        name: 'descr',
      },
    ]

    return inquirer.prompt(questions)
  },
  getThemeAuthor: async () => {
    const questions = [
      {
        type: 'input',
        message: 'Provide an OctoberCMS theme author',
        name: 'author',
      },
    ]

    return inquirer.prompt(questions)
  },
  getThemeWebsite: async () => {
    const questions = [
      {
        type: 'input',
        message: 'Provide an OctoberCMS theme home website',
        name: 'website',
      },
    ]

    return inquirer.prompt(questions)
  },
}
