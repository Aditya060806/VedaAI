import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import Redis from 'ioredis'

// Map of assignmentId → Set of connected WebSocket clients
const clients = new Map<string, Set<WebSocket>>()

// Redis subscriber for cross-process notifications from worker
let subscriber: Redis | null = null

function getSubscriber(): Redis {
  if (!subscriber) {
    subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: null,
      tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
    })

    subscriber.subscribe('ws:notify', (err) => {
      if (err) console.error('[WS] Redis subscribe error:', err)
    })

    subscriber.on('message', (_channel: string, message: string) => {
      try {
        const payload = JSON.parse(message)
        const { assignmentId } = payload
        if (!assignmentId) return
        const sockets = clients.get(assignmentId)
        if (!sockets) return
        const msg = JSON.stringify(payload)
        sockets.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) ws.send(msg)
        })
      } catch {
        // ignore malformed
      }
    })
  }
  return subscriber
}

export function setupWebSocket(server: Server) {
  // Start Redis subscriber
  getSubscriber()

  const wss = new WebSocketServer({ server, path: '/ws' })

  wss.on('connection', (ws: WebSocket) => {
    // Client sends: { type: 'subscribe', assignmentId: '...' }
    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString())
        if (msg.type === 'subscribe' && msg.assignmentId) {
          const id = msg.assignmentId as string
          if (!clients.has(id)) clients.set(id, new Set())
          clients.get(id)!.add(ws)

          ws.on('close', () => {
            clients.get(id)?.delete(ws)
            if (clients.get(id)?.size === 0) clients.delete(id)
          })

          ws.send(JSON.stringify({ type: 'subscribed', assignmentId: id }))
        }
      } catch {
        // ignore malformed messages
      }
    })
  })

  console.log('✅ WebSocket server ready on /ws')
  return wss
}

// Called directly when server and worker share the same process
export function notifyClients(
  assignmentId: string,
  payload: Record<string, unknown>
) {
  const sockets = clients.get(assignmentId)
  if (!sockets) return
  const msg = JSON.stringify(payload)
  sockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(msg)
  })
}
