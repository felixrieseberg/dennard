const { execSync } = require('child_process')

function getPsCmd(name = '') {
  const gp = `Get-Process -Name ${name}`
  const so = `Select-Object`
  const format = `Name='WorkingSet';Expression={($_.WorkingSet/1MB)}`
  const errorAction = `-ErrorAction SilentlyContinue`

  return `${gp} ${errorAction} | ${so} Id,Name,@{${format}}`
}

function getProcessResult(name = '') {
  const cmd = getPsCmd(name)

  return execSync(`powershell.exe "${cmd}"`).toString()
}

function analyzeResult(result = '') {
  const matchRgx = /^(\d*) (.*) {1,99}(\d*\.?\d*)$/gi
  const processes = result
    .split('\n')
    .map((k) => k.trim())
    .slice(2)
    .map((v) => matchRgx.exec(v))
    .filter((k) => !!k)
    .map((m) => ({
      pid: m[1],
      name: m[2],
      megabytes: parseInt(m[3], 10)
    }))
  const total = processes.reduce((c, { megabytes }) => c + megabytes, 0)

  return { processes, summary: { total } }
}

function dennard(name = '') {
  const result = getProcessResult(name)

  return analyzeResult(result)
}

module.exports = {
  dennard
}
