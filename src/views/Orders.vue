<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Order Management</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        Create New Order
      </button>
    </div>

    <!-- Orders List -->
    <div class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="card">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Order #{{ order.id }}</h3>
            <p class="text-sm text-gray-600">Customer: {{ order.userName }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-600">${{ order.total.toFixed(2) }}</div>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusColor(order.status)">
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
        </div>
        
        <!-- Order Items -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Items:</h4>
          <div class="space-y-1">
            <div v-for="item in order.products" :key="item.productId" 
                 class="flex justify-between text-sm text-gray-600">
              <span>{{ item.productName }} × {{ item.quantity }}</span>
              <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex space-x-2">
          <button @click="openEditModal(order)" class="btn btn-secondary">
            Edit Status
          </button>
          <button @click="deleteOrder(order.id)" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
      
      <div v-if="orders.length === 0" class="text-center py-12">
        <div class="text-gray-500">No orders found</div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-lg w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Update Order Status' : 'Create New Order' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveOrder" class="px-6 py-4 space-y-4">
          <div v-if="!isEditing">
            <label class="form-label">Customer Name</label>
            <input
              v-model="formData.userName"
              type="text"
              required
              class="form-input"
              placeholder="Enter customer name"
            />
          </div>
          
          <div v-if="!isEditing">
            <label class="form-label">User ID</label>
            <input
              v-model.number="formData.userId"
              type="number"
              required
              class="form-input"
              placeholder="Enter user ID"
            />
          </div>
          
          <div v-if="!isEditing">
            <label class="form-label">Total Amount ($)</label>
            <input
              v-model.number="formData.total"
              type="number"
              step="0.01"
              required
              class="form-input"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label class="form-label">Order Status</label>
            <select v-model="formData.status" required class="form-input">
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </form>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="closeModal" type="button" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="saveOrder" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { orderApi } from '@/services/api'
import { faro } from '@grafana/faro-web-sdk'
import type { Order } from '@/types'

// Injected global state
const setError = inject<(message: string) => void>('setError')
const globalLoading = inject<any>('loading')

// Component state
const orders = ref<Order[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const editingId = ref<number | null>(null)

const formData = ref({
  userId: 0,
  userName: '',
  total: 0,
  status: '' as Order['status'],
  products: [] as any[],
})

// Load orders
const loadOrders = async () => {
  try {
    globalLoading.value = true
    const response = await orderApi.getAll()
    orders.value = response.data.data
    
    // Log successful load
    if (faro) {
      faro.api.pushLog(['Orders loaded successfully', orders.value.length])
    }
  } catch (error) {
    console.error('Failed to load orders:', error)
    setError?.('Failed to load orders')
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Orders load failed: ${error}`))
    }
  } finally {
    globalLoading.value = false
  }
}

// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    userId: 0,
    userName: '',
    total: 0,
    status: 'pending',
    products: [{ productId: 1, productName: 'Sample Product', quantity: 1, price: 99.99 }],
  }
  showModal.value = true
}

// Open edit modal
const openEditModal = (order: Order) => {
  isEditing.value = true
  editingId.value = order.id
  formData.value = {
    userId: order.userId,
    userName: order.userName,
    total: order.total,
    status: order.status,
    products: order.products,
  }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  formData.value = {
    userId: 0,
    userName: '',
    total: 0,
    status: 'pending',
    products: [],
  }
}

// Save order (create or update)
const saveOrder = async () => {
  try {
    loading.value = true
    
    if (isEditing.value && editingId.value) {
      // Update existing order (only status can be updated)
      await orderApi.update(editingId.value, { status: formData.value.status })
      
      // Log successful update
      if (faro) {
        faro.api.pushLog(['Order updated successfully', editingId.value])
      }
    } else {
      // Create new order
      await orderApi.create(formData.value)
      
      // Log successful creation
      if (faro) {
        faro.api.pushLog(['Order created successfully', formData.value.userName])
      }
    }
    
    closeModal()
    await loadOrders() // Reload orders list
  } catch (error) {
    console.error('Failed to save order:', error)
    setError?.(`Failed to ${isEditing.value ? 'update' : 'create'} order`)
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Order save failed: ${error}`))
    }
  } finally {
    loading.value = false
  }
}

// Delete order
const deleteOrder = async (id: number) => {
  if (!confirm('Are you sure you want to delete this order?')) {
    return
  }
  
  try {
    globalLoading.value = true
    await orderApi.delete(id)
    
    // Log successful deletion
    if (faro) {
      faro.api.pushLog(['Order deleted successfully', id])
    }
    
    await loadOrders() // Reload orders list
  } catch (error) {
    console.error('Failed to delete order:', error)
    setError?.('Failed to delete order')
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Order deletion failed: ${error}`))
    }
  } finally {
    globalLoading.value = false
  }
}

// Get status color classes
const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Load orders on component mount
onMounted(() => {
  loadOrders()
})
</script> 