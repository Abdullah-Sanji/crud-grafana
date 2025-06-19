import axios, { AxiosResponse } from 'axios'
import { config } from '@/config/env'
import { faro } from '@grafana/faro-web-sdk'
import type { User, Product, Order, ApiResponse } from '@/types'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // Log API requests with Faro
    if (faro) {
      faro.api.pushLog(['API Request', config.method?.toUpperCase(), config.url])
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    if (faro) {
      faro.api.pushError(new Error(`API Request Error: ${error.message}`))
    }
    return Promise.reject(error)
  }
)

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    if (faro) {
      faro.api.pushLog(['API Response Success', response.status, response.config.url])
    }
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    // Log errors with Faro
    if (faro) {
      faro.api.pushError(new Error(`API Error: ${error.response?.status} ${error.config?.url} - ${error.message}`))
    }
    console.error('API Response Error:', error)
    return Promise.reject(error)
  }
)

// Mock data generators
const generateMockUsers = (): User[] => [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2023-01-01', updatedAt: '2023-12-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2023-02-01', updatedAt: '2023-11-01' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: '2023-03-01', updatedAt: '2023-10-01' },
]

const generateMockProducts = (): Product[] => [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 999.99, category: 'Electronics', stock: 10, createdAt: '2023-01-01', updatedAt: '2023-12-01' },
  { id: 2, name: 'Smartphone', description: 'Latest smartphone', price: 699.99, category: 'Electronics', stock: 25, createdAt: '2023-02-01', updatedAt: '2023-11-01' },
  { id: 3, name: 'Headphones', description: 'Noise-cancelling headphones', price: 199.99, category: 'Electronics', stock: 15, createdAt: '2023-03-01', updatedAt: '2023-10-01' },
]

const generateMockOrders = (): Order[] => [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    products: [{ productId: 1, productName: 'Laptop', quantity: 1, price: 999.99 }],
    total: 999.99,
    status: 'delivered',
    createdAt: '2023-11-01',
    updatedAt: '2023-11-15'
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Smith',
    products: [
      { productId: 2, productName: 'Smartphone', quantity: 1, price: 699.99 },
      { productId: 3, productName: 'Headphones', quantity: 1, price: 199.99 }
    ],
    total: 899.98,
    status: 'processing',
    createdAt: '2023-12-01',
    updatedAt: '2023-12-01'
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API responses
const mockApiCall = async <T>(data: T, shouldError = false): Promise<AxiosResponse<ApiResponse<T>>> => {
  await delay(Math.random() * 1000 + 500) // Random delay between 500-1500ms
  
  if (shouldError) {
    throw new Error('Simulated API Error: Something went wrong!')
  }
  
  return {
    data: {
      data,
      message: 'Success',
      success: true,
    },
    status: 200,
    statusText: 'OK',
  } as AxiosResponse<ApiResponse<T>>
}

// User API
export const userApi = {
  getAll: () => mockApiCall(generateMockUsers()),
  getById: (id: number) => mockApiCall(generateMockUsers().find(u => u.id === id)),
  create: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => 
    mockApiCall({ ...user, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
  update: (id: number, user: Partial<User>) => 
    mockApiCall({ ...generateMockUsers().find(u => u.id === id), ...user, updatedAt: new Date().toISOString() }),
  delete: (id: number) => mockApiCall({ id }, Math.random() < 0.3), // 30% chance of error
}

// Product API
export const productApi = {
  getAll: () => mockApiCall(generateMockProducts()),
  getById: (id: number) => mockApiCall(generateMockProducts().find(p => p.id === id)),
  create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    mockApiCall({ ...product, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
  update: (id: number, product: Partial<Product>) => 
    mockApiCall({ ...generateMockProducts().find(p => p.id === id), ...product, updatedAt: new Date().toISOString() }),
  delete: (id: number) => mockApiCall({ id }),
}

// Order API
export const orderApi = {
  getAll: () => mockApiCall(generateMockOrders()),
  getById: (id: number) => mockApiCall(generateMockOrders().find(o => o.id === id)),
  create: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => 
    mockApiCall({ ...order, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
  update: (id: number, order: Partial<Order>) => 
    mockApiCall({ ...generateMockOrders().find(o => o.id === id), ...order, updatedAt: new Date().toISOString() }),
  delete: (id: number) => mockApiCall({ id }),
} 