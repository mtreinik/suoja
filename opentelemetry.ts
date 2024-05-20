import { default as opentelemetryApi } from '@opentelemetry/api'
const opentelemetry = require('@opentelemetry/sdk-node')
// import {ConsoleSpanExporter} from "@opentelemetry/sdk-trace-base";
// const { HoneycombSDK } = require('@honeycombio/opentelemetry-node')
// import { WSInstrumentation } from 'opentelemetry-instrumentation-ws'
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { Resource } from '@opentelemetry/resources'
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'


// /**
//  * Check that required environment variables are provided
//  */
// if (!process.env.OTEL_SERVICE_NAME || !process.env.HONEYCOMB_API_KEY) {
//     console.error(
//         'please set environment variables OTEL_SERVICE_NAME and OTEL_SERVICE_NAME to send traces to Honeycomb.io'
//     )
//     process.exit(1)
// }
// const sdk = new HoneycombSDK({
//   traceExporter: new ConsoleSpanExporter(),
//   instrumentations: [
//     // new WSInstrumentation({
//     //   sendSpans: true,
//     //   messageEvents: true,
//     // }),
//     // getNodeAutoInstrumentations(),
//   ],
// })

export const sdk = new opentelemetry.NodeSDK({
    resource: new Resource({ [SEMRESATTRS_SERVICE_NAME]: 'my-service-mikko-ettii-service-namea' }),
    traceExporter: new ConsoleSpanExporter(),
})

sdk.start()

export const tracer = opentelemetryApi.trace.getTracer('suoja-client', 'test-v1')

export async function shutdownOpenTelemetryGracefully(reason: string) {
    console.log(`shutting down OpenTelemetry (reason: ${reason})`)
    try {
        await sdk.shutdown()
    } catch (err) {
        console.error(`error shutting down OpenTelemetry: ${err}`)
    }
    console.log('OpenTelemetry is shut down')
    process.exit(0)
}

process.on('SIGTERM', async () => {
    await shutdownOpenTelemetryGracefully('SIGTERM')
})

process.on('SIGINT', async () => {
    await shutdownOpenTelemetryGracefully('SIGINT')
})
