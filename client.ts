import { tracer, shutdownOpenTelemetryGracefully } from './opentelemetry'
import { doc, students, wsProvider } from './y'
import { Span } from '@opentelemetry/api'
const readline = require('readline')

/**
 * Notify user when websocket status changes
 */
wsProvider.on('status', (event: { status: string }) => {
  tracer.startActiveSpan(
    'on-websocket-status',
    { attributes: { status: event.status, clientID: doc.clientID } },
    (span: Span) => {
      console.log(`client ${doc.clientID} ${event.status}`)
      span.end()
    }
  )
})

/**
 * Notify user when students change
 */
students.observe((event) => {
  const attributes = { 'number-of-students': students.length }
  tracer.startActiveSpan('observe-students', { attributes }, (span: Span) => {
    console.log(`observing change in students: ${JSON.stringify(attributes)}`)
    span.end()
  })
})

/**
 * Create interface that reads input from stdin
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

/**
 * Create new student and add in the array shared by servers
 */
rl.on('line', (studentUuid: string) => {
  const createdAt = new Date().toISOString()
  tracer.startActiveSpan(
    'addStudent',
    { attributes: { clientId: doc.clientID, createdAt, studentUuid }, root: false },
    (span: Span) => {
      students.push([{ clientID: doc.clientID, createdAt, studentUuid }])
      span.end()
    }
  )
})
rl.on('close', async () => {
  await shutdownOpenTelemetryGracefully('input closed')
})

