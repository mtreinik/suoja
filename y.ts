import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";

interface Student {
    clientID: number
    createdAt: string
    studentUuid: string
}

export const doc = new Y.Doc()
export const students = doc.getArray<Student>('students')
export const wsProvider = new WebsocketProvider('ws://localhost:1234', 'school1', doc, {
    WebSocketPolyfill: require('ws'),
})
