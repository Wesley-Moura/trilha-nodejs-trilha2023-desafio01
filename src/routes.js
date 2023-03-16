import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const users = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400, {"Content-Type": "text/plain"}).end('Missing title and description field')
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400, {"Content-Type": "text/plain"}).end('Missing title and description field')
      }

      const taskExists = database.selectById('tasks', id)

      if (!taskExists) {
        return res.writeHead(404, {"Content-Type": "text/plain"}).end('Task does not exists')
      }

      database.update('tasks', id, {
        title,
        description,
      })
      
      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const taskExists = database.selectById('tasks', id)

      if (!taskExists) {
        return res.writeHead(404, {"Content-Type": "text/plain"}).end('Task does not exists')
      }

      database.delete('tasks', id)
      
      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const taskExists = database.selectById('tasks', id)

      if (!taskExists) {
        return res.writeHead(404, {"Content-Type": "text/plain"}).end('Task does not exists')
      }

      database.ChangeCompleteAt('tasks', id)
      
      return res.writeHead(204).end()
    },
  }
]