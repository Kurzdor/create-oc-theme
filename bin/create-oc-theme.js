#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const { green, red, cyan, yellow } = require('chalk')
const clear = require('clear')
const json2yaml = require('json2yaml')
const execa = require('execa')
const pkg = require('../package.json')
const {
  getThemeName,
  getThemeDescr,
  getThemeAuthor,
  getThemeWebsite,
} = require('../lib/inquirer.js')
const devDepsArray = require('../lib/devDepsArray.js')

clear()

const run = async () => {
  console.log(cyan(`create-oc-theme CLI v${pkg.version}`))

  const { themename } = await getThemeName()
  const { descr } = await getThemeDescr()
  const { author } = await getThemeAuthor()
  const { website } = await getThemeWebsite()

  const themeInfo = {
    name: themename,
    description: descr,
    author,
    homepage: website,
    code: '',
  }

  const packageJson = {
    name: themename,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'npm run development',
      development:
        'cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js',
      watch:
        'cross-env NODE_ENV=development node_modules/webpack/bin/webpack.js --watch --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js',
      prod: 'npm run production',
      production:
        'cross-env NODE_ENV=production node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js',
    },
  }

  console.log(`${yellow('(ℹ)')} Copying template files...`)
  console.log('')

  try {
    await fs.copy(
      path.resolve(__dirname, '../template/'),
      path.resolve(process.cwd(), themename)
    )
  } catch (error) {
    console.log(`${red('(✖)')} ${err}`)
    process.exit(1)
  }

  console.log(`${green('(✔)')} Successfully copied all template files!`)
  console.log('')

  console.log(`${yellow('(ℹ)')} Generating new theme.yaml file...`)
  console.log('')

  try {
    await fs.outputFile(
      path.resolve(process.cwd(), themename, 'theme.yaml'),
      json2yaml.stringify(themeInfo)
    )
  } catch (err) {
    console.log(`${red('(✖)')} ${err}`)
    process.exit(1)
  }

  console.log(`${yellow('(ℹ)')} Generating new package.json file...`)
  console.log('')

  try {
    await fs.outputJSON(
      path.resolve(process.cwd(), themename, 'package.json'),
      packageJson,
      {
        spaces: 2,
      }
    )
  } catch (err) {
    console.log(`${red('(✖)')} ${err}`)
    process.exit(1)
  }

  console.log(`${green('(✔)')} Successfully generated package.json!`)
  console.log('')

  console.log(`${yellow('(ℹ)')} Installing all devDependencies...`)
  console.log('')

  process.chdir(path.resolve(themename))
  const pkgMgrArgs = ['install', '--save-dev'].concat(devDepsArray)

  try {
    await execa('npm', pkgMgrArgs, {
      stdio: 'inherit',
    })
  } catch (err) {
    console.log(`${red('✖')} ${err}`)
    process.exit(1)
  }

  console.log(
    `${green('(✔)')} Successfully installed all devDependencies!`
  )
  console.log('')

  const dependencies = ['jquery', 'swiper', '@babel/polyfill']

  console.log(`${yellow('(ℹ)')} Installing dependencies...`)
  console.log('')

  try {
    await execa('npm', dependencies, {
      stdio: 'inherit',
    })
  } catch (err) {
    console.log(`${red('✖')} ${err}`)
    process.exit(1)
  }

  console.log(`${green('(✔)')} Successfully installed dependencies!`)
  console.log('')

  console.log(
    `🎉  Successfully initialized theme in ${green(themename)} directory!`
  )
  console.log('')
  console.log(
    `🚀  Now continue with typing ${green(`cd ${themename}`)} && ${green(
      'npm start'
    )} to start!`
  )
  console.log('')
  console.log(`🔥  Happy coding!`)
  process.exit(0)
}

run()
