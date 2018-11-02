const readline = require('readline')

const { getLogTable } = require('./utilities')

function dennard() {
  let dennard

  if (process.platform === 'win32') {
    ({
      dennard
    } = require('./win'))
  } else {
    ({
      dennard
    } = require('./unix'))
  }

  const nameCandidateArgs = process
    .argv
    .filter((v) => v !== '-w' && v !== '--watch')
  const name = nameCandidateArgs[nameCandidateArgs.length - 1]

  const isWatch = process.argv.find((v) => v === '-w' || v === '--watch')

  if (!isWatch) {
    console.log(getLogTable(dennard(name)))
  } else {
    let lines = []

    const runner = () => {
      const logTable = getLogTable(dennard(name))

      // Clear
      lines.slice(1).forEach(() => {
        readline.moveCursor(process.stdout, 0, -1)
        readline.clearLine(process.stdout, 0)
      })

      lines = logTable.split('\n')
      process.stdout.write(logTable)
    }

    runner()
    setInterval(runner, 2000)
  }
}

module.exports = {
  dennard
}