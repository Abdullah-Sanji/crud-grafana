<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">Welcome to Vue Grafana Faro App</h1>
      <p class="mt-2 text-lg text-gray-600">
        A modern Vue.js 3 application with TypeScript, Tailwind CSS, and Grafana Faro monitoring
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Users</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.users }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Products</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.products }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Orders</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.orders }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-900">Vue.js 3 with Composition API</h3>
              <p class="text-sm text-gray-500">Modern reactive framework with TypeScript support</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-900">Tailwind CSS</h3>
              <p class="text-sm text-gray-500">Utility-first CSS framework for rapid UI development</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-900">TypeScript</h3>
              <p class="text-sm text-gray-500">Static type checking for better code quality</p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-red-600 rounded-full"></div>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-900">Grafana Faro Integration</h3>
              <p class="text-sm text-gray-500">Real-time monitoring and error tracking</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-900">Mock API Integration</h3>
              <p class="text-sm text-gray-500">Simulated backend with CRUD operations</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-gray-900">Environment Configuration</h3>
              <p class="text-sm text-gray-500">Configurable API and monitoring endpoints</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-4">
        <router-link to="/users" class="btn btn-primary">
          Manage Users
        </router-link>
        <router-link to="/products" class="btn btn-secondary">
          View Products
        </router-link>
        <router-link to="/orders" class="btn btn-secondary">
          Track Orders
        </router-link>
        <button @click="testError" class="btn btn-danger">
          Test Error Handling
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { userApi, productApi, orderApi } from '@/services/api'
import { faro } from '@grafana/faro-web-sdk'

// Injected global state
const setError = inject<(message: string) => void>('setError')

// Component state
const stats = ref({
  users: 0,
  products: 0,
  orders: 0,
})

// Load dashboard stats
const loadStats = async () => {
  try {
    const [usersRes, productsRes, ordersRes] = await Promise.all([
      userApi.getAll(),
      productApi.getAll(),
      orderApi.getAll(),
    ])

    stats.value = {
      users: usersRes.data.data.length,
      products: productsRes.data.data.length,
      orders: ordersRes.data.data.length,
    }

    // Log successful dashboard load
    if (faro) {
      faro.api.pushLog(['Dashboard loaded successfully'])
    }
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
    setError?.('Failed to load dashboard statistics')
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Dashboard load failed: ${error}`))
    }
  }
}

// Test error handling
const testError = () => {
  const error = new Error('This is a test error for Grafana Faro monitoring')
  console.error('Test error triggered:', error)
  
  // Push error to Faro
  if (faro) {
    faro.api.pushError(error)
    faro.api.pushLog(['Test error triggered by user'])
  }
  
  setError?.('Test error triggered! Check your monitoring dashboard.')
}

// Load data on component mount
onMounted(() => {
  loadStats()
})
</script> 