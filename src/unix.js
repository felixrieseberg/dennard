const { execSync } = require('child_process')
const { tmpdir } = require('os')
const path = require('path')
const fs = require('fs')

/**
 * Return the pids matching the given name
 *
 * @param {string} name
 */
function getPids(name = '') {
  const cmd = `ps x -ao pid,command | grep "${name}" | awk '{print $1}'`
  const raw = execSync(cmd)
  const pids = raw
    .toString()
    .split('\n')
    .filter((p) => p)
    .filter((p) => parseInt(p, 10) < (process.pid - 1))

  return pids
}

function getTempPath() {
  const tmp = path.join(tmpdir(), 'dennard')

  try {
    fs.mkdirSync(tmp)
  } catch (error) {
    // Already exists
  }

  return path.join(tmp, `${Date.now()}.json`)
}

function getDennard(pids = []) {
  const tmpFile = getTempPath()
  const pidParam = pids.map((p) => `-p ${p}`).join(' ')
  const cmd = `sudo footprint ${pidParam} --summary --json ${tmpFile}`

  execSync(cmd)

  return tmpFile
}

function analyzeDennardFile(file = '') {
  const content = fs.readFileSync(file, 'utf8')
  const parsed = JSON.parse(content)
  const processes = []
  const bytesPerPage = parseInt(parsed['bytes per unit'], 10)
  const total = parseInt(parsed['total footprint'], 10) * bytesPerPage  / 1024 / 1024

  for (const proc of parsed.processes) {
    const { name, footprint, pid } = proc
    const total = bytesPerPage * parseInt(footprint, 10)
    const megabytes = Math.round(total / 1024 / 1024 * 100) / 100

    processes.push({
      name,
      pid,
      megabytes
    })
  }

  fs.unlinkSync(file)

  return { processes, summary: { total } }
}

function dennard(name = '') {
  const pids = getPids(name)

  if (!pids || pids.length === 0) {
    console.warn(`No processes found for ${name}.`)
    process.exit()
  }

  const file = getDennard(pids)
  const data = analyzeDennardFile(file)

  return data
}

module.exports = {
  dennard
}
