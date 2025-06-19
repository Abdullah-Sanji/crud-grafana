export const config = {
  // API Base URL - overridable via environment variable
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // Grafana Faro Collector URL - overridable via environment variable
  faroCollectorUrl: import.meta.env.VITE_FARO_COLLECTOR_URL || 'http://localhost:12347/collect',
  
  // Other configuration
  environment: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
} 