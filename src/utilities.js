const TABLE_CHARS = {
  top: '─',
  topMid: '┬',
  topLeft: '┌',
  topRight: '┐',
  bottom: '─',
  bottomMid: '┴',
  bottomLeft: '└',
  bottomRight: '┘',
  left: '│',
  leftMid: '├',
  hMid: '─',
  midMid: '┼',
  right: '│',
  rightMid: '┤',
  vMid: '│'
}

function repeatStr(str, length) {
  return str.padEnd(length, str)
}

function getHeaderLine(lengths = []) {
  return lengths.reduce((previous, current, i) => {
    const endChar = i === lengths.length - 1
      ? TABLE_CHARS.topRight
      : TABLE_CHARS.topMid

    return previous += repeatStr(TABLE_CHARS.top, current + 2) + endChar
  }, TABLE_CHARS.topLeft)
}

function getDividerLine(lengths = []) {
  return lengths.reduce((previous, current, i) => {
    const endChar = i === lengths.length - 1
      ? TABLE_CHARS.rightMid
      : TABLE_CHARS.midMid

    return previous += repeatStr(TABLE_CHARS.hMid, current + 2) + endChar
  }, TABLE_CHARS.leftMid)
}

function getBottomLine(lengths = []) {
  return lengths.reduce((previous, current, i) => {
    const endChar = i === lengths.length - 1
      ? TABLE_CHARS.bottomRight
      : TABLE_CHARS.bottomMid

    return previous += repeatStr(TABLE_CHARS.hMid, current + 2) + endChar
  }, TABLE_CHARS.bottomLeft)
}

function getLogTable({processes, summary} = result) {
  if (processes.length === 0) {
    return `No processes found.`
  }

  const columns = processes.reduce((cols, p) => {
    Object
      .keys(p)
      .forEach((k) => {
        cols[k] = cols[k] || []
        cols[k].push(p[k].toString())
      })
    return cols
  }, {})

  // Calculate lengths
  const lengths = Object
    .keys(columns)
    .map((k) => Math.max(...(columns[k].map((el) => el.length)), k.length) + 4)

  const lines = []
  Object
    .keys(columns)
    .forEach((k, i, arr) => {
      const isLastColumn = i === arr.length - 1
      const endChar = isLastColumn
        ? TABLE_CHARS.right
        : TABLE_CHARS.vMid

      // Names
      lines[0] = lines[0] || `${TABLE_CHARS.left} `
      lines[0] += k.padEnd(lengths[i]) + ` ${endChar} `

      // Columns
      columns[k].forEach((p, ii) => {
        lines[ii + 1] = lines[ii + 1] || `${TABLE_CHARS.left} `
        lines[ii + 1] += p.padEnd(lengths[i]) + ` ${TABLE_CHARS.vMid} `
      })
    })

  const total = Math.round(summary.total * 100) / 100
  lines.splice(0, 0, getHeaderLine(lengths))
  lines.splice(2, 0, getDividerLine(lengths))
  lines.splice(lines.length, 0, getBottomLine(lengths))
  lines.push(`\n Total memory footprint: ${total}MB\n`)
  return lines.join('\n')
}

module.exports = {
  getLogTable
}
