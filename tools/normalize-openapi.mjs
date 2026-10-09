// Narrow OpenAPI correction for WeatherAPI.com.
// The upstream spec uses /current.json#bulk to distinguish POST from GET.
// A URL fragment is not part of the server request path; appending ?key=
// after #bulk incorrectly hides the credential inside the fragment.
// Merge operations into their real URL path, retaining both GET and POST.
// This intentionally runs *before* Voxgig's generator.
import { readFileSync, writeFileSync } from 'node:fs'

const [input, output] = process.argv.slice(2)
if (!input || !output) throw new Error('Usage: node tools/normalize-openapi.mjs INPUT OUTPUT')

const spec = JSON.parse(readFileSync(input, 'utf8'))
if (!spec.paths || typeof spec.paths !== 'object') throw new Error('OpenAPI spec has no paths')

const result = {}
const httpMethods = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'])
const changes = []

for (const [rawPath, pathItem] of Object.entries(spec.paths)) {
  const hash = rawPath.indexOf('#')
  const path = hash === -1 ? rawPath : rawPath.slice(0, hash)
  if (!path.startsWith('/') || !path) throw new Error('Invalid OpenAPI route: ' + rawPath)
  if (hash !== -1) changes.push(rawPath + ' -> ' + path)

  if (!result[path]) result[path] = {}
  for (const [field, value] of Object.entries(pathItem)) {
    if (Object.prototype.hasOwnProperty.call(result[path], field)) {
      throw new Error('Conflicting path item field ' + field + ' at ' + path)
    }
    // Do not change operation definitions, only their invalid route key.
    result[path][field] = value
  }
}

spec.paths = result
writeFileSync(output, JSON.stringify(spec, null, 2) + '\n')
console.log('Normalized OpenAPI routes:', changes.length)
for (const change of changes) console.log('  ' + change)
console.log('Canonical routes:', Object.keys(spec.paths).length)
