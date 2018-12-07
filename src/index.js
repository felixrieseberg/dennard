const readline = require('readline')

const {getLogTable} = require('./utilities')

function main() {
  const isWin = process.platform === 'win32'
  const dennardExec = isWin
    ? require('./win')
    : require('./unix')

  process.argv.shift() // node.exe
  process.argv.shift() // src/index.js

  const isWatch = process.argv.some((v) => v === '-w' || v === '--watch')
  const names = process.argv.filter((v) => v !== '-w' && v !== '--watch')

  const thunk = () => names.map(name => getLogTable(dennardExec(name))).join('\n\n')

  if (!isWatch) {
    const logTable = thunk()
    process.stdout.write(logTable)
    return
  }

  let lines = []

  const runIt = () => {
    const logTable = thunk()

    // Clear screen
    lines
      .slice(1)
      .forEach(() => {
        readline.moveCursor(process.stdout, 0, -1)
        readline.clearLine(process.stdout, 0)
      })

    lines = logTable.split('\n')
    process.stdout.write(logTable)
  }

  setInterval(runIt, 2000)
  runIt()
}
main()
