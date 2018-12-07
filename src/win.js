const {execSync} = require('child_process')

function getPsCmd(name = '') {
  const gp = `Get-Process -Name \"${name}\"`
  const so = `Select-Object`
  const format = `Name='WorkingSet';Expression={($_.WorkingSet/1MB)}`
  const errorAction = `-ErrorAction SilentlyContinue`

  const cmd = `${gp} ${errorAction} | ${so} Id,Name,@{${format}}`
  console.log({cmd})
  return cmd
}

function analyzeResult(result = '') {
  const processes = result
    .split('\n')
    .map((k) => k.trim())
    .slice(3)
    .map((v) => /^(\d*) (.*) {1,99}(\d*\.?\d*)$/gi.exec(v))
    .filter((v) => v)
    .map(([, pid, name, megabytes]) => ({
      pid,
      name,
      megabytes: parseInt(megabytes, 10)
    }))
  const total = processes.reduce((c, {megabytes}) => (c + megabytes), 0)

  return {
    processes,
    summary: {
      total
    }
  }
}

const getProcessResult = (name = '') => execSync(`powershell.exe "${getPsCmd(name)}"`).toString()
const dennard = (name = '') => analyzeResult(getProcessResult(name))

module.exports = dennard
