import fs from 'node:fs'
import { parse } from 'csv-parse'

async function createTask(task) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  }

  await fetch('http://localhost:3333/tasks', options)
    .then(response => response.text())
    .then(response => console.log(response))
    .catch(err => console.error(err))
}

function extractTaskFromRow(row, columns) {
  return columns.reduce((task, column, index) => {
    task[column] = row[index]

    return task
  }, {})
}

function csvGenerator(filePath) {
  return fs.createReadStream(filePath).pipe(parse())
}

let columns = undefined

for await (const row of csvGenerator('./csv/tasks.csv')) {
  if (!columns) {
    columns = row
    continue
  }

  let task = extractTaskFromRow(row, columns)

  await createTask(task)
}