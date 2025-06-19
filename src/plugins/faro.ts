import { getWebInstrumentations, initializeFaro as initFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

export function initializeFaro() {
  // Get Faro collector URL from environment variable or use default
  const faroCollectorUrl = import.meta.env.VITE_FARO_COLLECTOR_URL || 'http://localhost:12347/collect'
  
  // Only initialize Faro if collector URL is provided
  if (faroCollectorUrl) {
    try {
      initFaro({
        url: faroCollectorUrl,
        app: {
          name: 'vue-grafana-faro-app',
          version: '1.0.0',
          environment: import.meta.env.MODE || 'development',
        },
        instrumentations: [
          // Loads the default Web instrumentations
          ...getWebInstrumentations(),
          
          // Tracing instrumentation
          new TracingInstrumentation(),
        ],
      })
      
      console.log('Grafana Faro initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Grafana Faro:', error)
    }
  } else {
    console.warn('Grafana Faro collector URL not provided, skipping initialization')
  }
} 