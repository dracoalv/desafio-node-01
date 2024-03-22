import fs from 'node:fs/promises'

const databasePath = './db.json'

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => this.#database = JSON.parse(data))
      .catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }

  exists(table, id) {
    if (!id) {
      return false
    }

    let data = this.#database[table] ?? []    

    return data.findIndex(row => row.id === id) !== -1
  }

  select(table, id) {
    let data = this.#database[table] ?? []
    
    if (id) {
      data = data.find(row => row.id === id)
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const currentRowData = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = { ...currentRowData, ...data }
      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}