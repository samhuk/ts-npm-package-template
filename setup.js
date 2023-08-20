/**
 * This script performs various tasks that setup the template.
 *
 * It replaces instances of placeholder words, runs `npm i`, etc.
 *
 * To run this script, run `node setup.js` from the package template root directory.
 */

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const FILES_WITH_TOKENS = [
  './README.md',
  './package.json',
  './LICENSE',
  './src/types.ts',
  './src/index.ts',
  './src/npm-package-name/index.ts',
  './src/npm-package-name/types.ts',
  './src/npm-package-name/index.spec.ts',
  './examples/index.ts',
]

const r1 = readline.createInterface({ input: process.stdin, output: process.stdout })

const dashToCamel = dashCase => (
  dashCase.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
)

const removeDirectoryRecursively = dirPath => {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) 
      removeDirectoryRecursively(filePath)
    else
      fs.unlinkSync(filePath)
  })

  fs.rmdirSync(dirPath)
}

const VALIDATORS = {
  isNonEmptyString: { op: s => s != null && s.length > 0, errMsg: 'Cannot be empty' },
  hasNoSpaces: { op: s => s.indexOf(' ') === -1, errMsg: 'Cannot have whitespace' },
  isValidDashCaseName: { op: s => /^[a-zA-Z0-9\-@]+$/.test(s), errMsg: 'Must contain only letters, numbers, \'-\' and \'@\'' },
}

const _getInput = (question, validators, defaultIfEmpty, onComplete) => {
  const _question = defaultIfEmpty != null ? `${question} [${defaultIfEmpty}]: ` : `${question}: `
  r1.question(_question, name => {
    const isEmpty = !VALIDATORS.isNonEmptyString.op(name)
    if (isEmpty && defaultIfEmpty != null) {
      onComplete(defaultIfEmpty)
    }
    else if (validators != null) {
      const errMsgList = validators.reduce((acc, validator) => (validator.op(name) ? acc : acc.concat(validator.errMsg)), [])
      if (errMsgList.length === 0) {
        onComplete(name)
      }
      else {
        console.log('Error:', errMsgList.join(', '))
        _getInput(question, validators, defaultIfEmpty, onComplete)
      }
    }
    else {
      onComplete(name)
    }
  })
}

const getInput = (question, validators, defaultIfEmpty) =>  new Promise(res => {
  _getInput(question, validators, defaultIfEmpty, res)
})

const getToken = async (name, validators, defaultIfEmpty) => {
  const value = await getInput(name, validators, defaultIfEmpty)
  return { name, value }
}

const _replaceTokensInFiles = (filePaths, tokenMapEntries, i, onComplete) => {
  if (i >= filePaths.length) {
    onComplete()
    return
  }

  const filePath = filePaths[i]

  console.log(`--> ${filePath}`)

  const fileText = fs.readFileSync(filePath, 'utf8')
  let newFileText = fileText
  tokenMapEntries.forEach(tokenMapEntry => {
    newFileText = newFileText.replace(new RegExp(tokenMapEntry[0], 'g'), tokenMapEntry[1])
  })
  fs.writeFileSync(filePath, newFileText)

  _replaceTokensInFiles(filePaths, tokenMapEntries, i + 1, onComplete)
}

const replaceTokensInFiles = (filePaths, tokenMap) => new Promise(res => {
  console.log('\n==> Replacing placeholder words in files...')
  const tokenMapEntries = Object.entries(tokenMap)
  _replaceTokensInFiles(filePaths, tokenMapEntries, 0, res)
})

const npmInstall = () => new Promise((res, rej) => {
  console.log('==> Installing npm dependencies...')
  exec('npm i', err => {
    if (err != null) {
      console.log(err)
      rej(err)
    }
    else {
      res()
    }
  })
})

const renameTokensInFileNames = (filePaths, tokenMap) => {
  console.log('\n==> Replacing placeholder words in file names...')
  const tokenMapEntries = Object.entries(tokenMap)
  filePaths.forEach(filePath => {
    let newFilePath = filePath
    tokenMapEntries.forEach(tokenMapEntry => {
      newFilePath = newFilePath.replace(new RegExp(tokenMapEntry[0], 'g'), tokenMapEntry[1])
    })

    if (!fs.existsSync(path.dirname(newFilePath)))
      fs.mkdirSync(path.dirname(newFilePath), { recursive: true })

    fs.renameSync(path.resolve(filePath), path.resolve(newFilePath))
  })
}

const createTokenMap = tokens => {
  const map = {}
  tokens.forEach(token => {
    map[`{{${token.name}}}`] = token.value
    map[token.name] = token.value
  })
  return map
}

// ------------------------
// -- Token collectors
// ------------------------
const getRepoName = () => getToken('repo-name', [VALIDATORS.isValidDashCaseName], 'repo-name')
const getNpmPackageName = defaultValue => getToken('npm-package-name', [VALIDATORS.isValidDashCaseName], defaultValue)
const getLicenseName = () => getToken('license-name', [], 'Joe Bloggs')
const getLicenseEmail = () => getToken('license-email', [VALIDATORS.hasNoSpaces], 'joebloggs@email.com')
const getGithubUserName = () =>  getToken('github-user-name', [VALIDATORS.hasNoSpaces], 'joebloggs')
const getPackageSlogan = () => getToken('package-slogan', [], 'Delightful Typescript Package')

const main = async () => {
  // -- Get token map
  const repoName = await getRepoName()
  const npmPackageName = await getNpmPackageName(repoName.value)
  const camelCaseNpmPackageName = { name: 'npmPackageName', value: dashToCamel(npmPackageName.value) }
  const licenseName = await getLicenseName()
  const licenseEmail = await getLicenseEmail()
  const githubUserName = await getGithubUserName()
  const packageSlogan = await getPackageSlogan()
  r1.close()
  const tokenMap = createTokenMap([repoName, npmPackageName, camelCaseNpmPackageName, licenseName, licenseEmail, githubUserName, packageSlogan])

  // Replace tokens and install NPM dependencies
  await replaceTokensInFiles(FILES_WITH_TOKENS, tokenMap)
  renameTokensInFileNames(FILES_WITH_TOKENS, tokenMap)
  removeDirectoryRecursively('./src/npm-package-name/')
  await npmInstall()

  console.log('\n------------------------------\n\nSetup complete! You may delete this script now.')
  console.log('Try running `npm run unit-tests` and `npm run check`.')
  console.log('\nHappy hacking! :)')
}

main()
