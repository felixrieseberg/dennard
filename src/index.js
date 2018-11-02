const { logTable } = require('./utilities')

function dennard() {
  let dennard

  if (process.platform === 'darwin') {
    ({ dennard } = require('./unix'))
  } else {

  }

  logTable(dennard())
}

module.exports = {
  dennard
}
