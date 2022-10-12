const fs = require('fs')
const readline = require('readline')

const r1 = readline.createInterface({ input: process.stdin, output: process.stdout })

const VALIDATORS = {
  isNonEmptyString: { op: s => s != null && s.length > 0, errMsg: 'Cannot be empty' },
  hasNoSpaces: { op: s => s.indexOf(' ') === -1, errMsg: 'Cannot have whitespace' }
}

const tryGetInput = (question, onComplete, validators, defaultIfEmpty) => {
  const _question = defaultIfEmpty != null ? `${question} [${defaultIfEmpty}]: ` : `${question}: `
  r1.question(_question, (name) => {
    const isEmpty = !VALIDATORS.isNonEmptyString.op(name)
    if (isEmpty && defaultIfEmpty != null) {
      onComplete(defaultIfEmpty)
    }
    else if (validators != null) {
      const errMsgList = validators.reduce((acc, validator) => validator.op(name) ? acc : acc.concat(validator.errorMsg))
      if (errMsgList.length === 0) {
        onComplete(name)
      }
      else {
        console.log('Error:', errMsgList.join(', '))
        tryGetInput(question, onComplete, validators, defaultIfEmpty)
      }
    }
    else {
      onComplete(name)
    }
  })
}

const getDashCasePackageName = () => new Promise((res, rej) => {
  tryGetInput('package-name', res, [], 'example-package')
})

const getNpmPackageName = () => new Promise((res, rej) => {
  tryGetInput('npm-package-name', res, [], 'example-package')
})

const getLicenseName = () => new Promise((res, rej) => {
  tryGetInput('license-name', res, [], 'Joe Bloggs')
})

const getLicenseEmail = () => new Promise((res, rej) => {
  tryGetInput('license-email', res, [], 'joebloggs@email.com')
})

const getGithubUserName = () => new Promise((res, rej) => {
  tryGetInput('github-user-name', res, [], 'joebloggs')
})

const _replaceTokensInFiles = (filePaths, tokenMapEntries, i, onComplete) => {
  if (i >= filePaths.length) {
    onComplete()
    return
  }

  const filePath = filePaths[i]

  console.log(`--> ${filePath}`)

  const fileText = fs.readFileSync(filePath, 'utf8')
  tokenMapEntries.forEach(tokenMapEntry => {
    fileText.replace(tokenMapEntry[0], tokenMapEntry[1])
  })

  _replaceTokensInFiles(filePaths, tokenMapEntries, i + 1, onComplete)
}

const replaceTokensInFiles = (filePaths, tokenMap) => new Promise((res, rej) => {
  console.log('\n==> Replacing tokens in files')
  const tokenMapEntries = Object.entries(tokenMap)
  _replaceTokensInFiles(filePaths, tokenMapEntries, 0, res)
})

const main = async () => {
  const dashCasePackageName = await getDashCasePackageName()
  const npmPackageName = await getNpmPackageName()
  const licenseName = await getLicenseName()
  const licenseEmail = await getLicenseEmail()
  const githubUserName = await getGithubUserName()

  const tokenMap = {
    'package-name': dashCasePackageName,
    'npm-package-name': npmPackageName,
    'license-name': licenseName,
    'license-email': licenseEmail,
    'github-user-name': githubUserName
  }

  await replaceTokensInFiles(['./README.md', './package.json', './LICENSE'], tokenMap)

  console.log('\nSetup complete! Run `npm i` and then `npm run unit-tests`. Later on, you can try `npm publish`.')
  r1.close()
}

main()
