import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = resolve(appRoot, '..')
const publicDataDirectory = resolve(appRoot, 'public', 'data')

const copies = [
  {
    source: resolve(repositoryRoot, 'data', 'processed', 'cliente_360.json'),
    destination: resolve(publicDataDirectory, 'clientes_360.json'),
    expectedRows: 2200,
  },
  {
    source: resolve(repositoryRoot, 'data', 'processed', 'data_quality_report.json'),
    destination: resolve(publicDataDirectory, 'data_quality_report.json'),
  },
]

await mkdir(publicDataDirectory, { recursive: true })

for (const item of copies) {
  const sourceContent = await readFile(item.source, 'utf8')
  const parsed = JSON.parse(sourceContent)

  if (item.expectedRows !== undefined && parsed.length !== item.expectedRows) {
    throw new Error(
      `Se esperaban ${item.expectedRows} clientes en ${item.source}, se encontraron ${parsed.length}.`,
    )
  }

  await copyFile(item.source, item.destination)
  console.log(`Sincronizado: ${item.destination}`)
}
