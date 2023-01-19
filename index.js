import { fileURLToPath } from 'url'
import Path from 'path'
import express from 'express'
import Gun from 'gun'
import dotenv from 'dotenv'

dotenv.config()

process.env.PORT ??= 8080
process.env.GUN_STORAGE_PATH ??=  Path.join(Path.dirname(fileURLToPath(import.meta.url)), 'gun-storage')

process.on('unhandledRejection', bail)
process.on('uncaughtException', bail)

const app = express()
app.use(Gun.serve)

app.get('/', (req, res) => {
  res.json({status: 'ok'})
})

const server = app.listen(process.env.PORT)
Gun({
  web: server,
  file: process.env.GUN_STORAGE_PATH,
})

console.log(`Gun data stored in ${process.env.GUN_STORAGE_PATH}`)
console.log(`Gun server up at http://localhost:${server.address().port}/gun`)

function bail(exception) {
  console.error(exception)
  process.exit(1)
}
