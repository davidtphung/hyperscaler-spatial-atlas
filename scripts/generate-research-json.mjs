import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const vals = []
    let cur = ''
    let q = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        q = !q
        continue
      }
      if (c === ',' && !q) {
        vals.push(cur.trim())
        cur = ''
        continue
      }
      cur += c
    }
    vals.push(cur.trim())
    const o = {}
    headers.forEach((h, i) => {
      o[h] = vals[i] ?? ''
    })
    return o
  })
}

const dir = path.join(root, 'research/data')
const out = {}
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.csv'))) {
  out[f.replace('.csv', '')] = parseCsv(fs.readFileSync(path.join(dir, f), 'utf8'))
}

const target = path.join(root, 'src/data/generated/researchData.json')
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, JSON.stringify(out, null, 2))
console.log('Wrote', target)