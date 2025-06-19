<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Vue Grafana Faro App</h1>
          </div>
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              v-for="route in routes"
              :key="route.name"
              :to="route.path"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-gray-100 text-gray-900': $route.name === route.name }"
            >
              {{ route.name }}
            </router-link>
          </div>
          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link
            v-for="route in routes"
            :key="route.name"
            :to="route.path"
            class="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            :class="{ 'bg-gray-100 text-gray-900': $route.name === route.name }"
            @click="mobileMenuOpen = false"
          >
            {{ route.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Global loading overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="text-gray-900">Loading...</span>
      </div>
    </div>

    <!-- Global error toast -->
    <div
      v-if="error"
      class="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md"
    >
      <div class="flex justify-between items-start">
        <div>
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline ml-1">{{ error }}</span>
        </div>
        <button @click="error = null" class="ml-4 text-red-500 hover:text-red-700">
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'

// Global state
const loading = ref(false)
const error = ref<string | null>(null)
const mobileMenuOpen = ref(false)

// Navigation routes
const routes = [
  { name: 'Home', path: '/' },
  { name: 'Users', path: '/users' },
  { name: 'Products', path: '/products' },
  { name: 'Orders', path: '/orders' },
]

// Provide global state to child components
provide('loading', loading)
provide('error', error)

// Global error handler
const setError = (message: string) => {
  error.value = message
  setTimeout(() => {
    error.value = null
  }, 5000)
}

provide('setError', setError)
</script> 