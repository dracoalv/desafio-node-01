import crypto from 'node:crypto'

import { Database } from "./database/database.js";
import { buildRoutePath } from "./lib/utils.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? { task: search } : null)
      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const tasks = database.select('tasks', id)
      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: crypto.randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      database.insert('tasks', task)
      return res.writeHead(201).end(JSON.stringify({ message: 'Registro criado' }))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      
      const exists = database.exists('tasks', id)

      if (!exists) {
        return res.writeHead(404).end(JSON.stringify({ error: 'Este registro não existe.' }))
      }

      const updatedTask = {
        title,
        description,
        updated_at: new Date()
      }

      database.update('tasks', id, updatedTask)

      return res.writeHead(201).end(JSON.stringify({ message: 'Registro atualizado' }))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      database.update('tasks', id, { completed_at: true })
      return res.writeHead(200).end(JSON.stringify({ message: 'Registro atualizado' }))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)
  
      return res.writeHead(200).end(JSON.stringify({ message: 'Registro deletado' }))
    }
  }
]