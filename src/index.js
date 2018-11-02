const { logTable } = require('./utilities')

function dennard() {
  let dennard

  if (process.platform === 'win32') {
    ({ dennard } = require('./win'))
  } else {
    ({ dennard } = require('./unix'))
  }

  const name = process.argv[process.argv.length - 1]

  logTable(dennard(name))
}

module.exports = {
  dennard
}
