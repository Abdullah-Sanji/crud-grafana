<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Product Management</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        Add New Product
      </button>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in products" :key="product.id" class="card">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
          <span class="text-2xl font-bold text-green-600">${{ product.price.toFixed(2) }}</span>
        </div>
        
        <p class="text-gray-600 text-sm mb-4">{{ product.description }}</p>
        
        <div class="flex justify-between items-center mb-4">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {{ product.category }}
          </span>
          <span class="text-sm" :class="product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'">
            Stock: {{ product.stock }}
          </span>
        </div>
        
        <div class="flex space-x-2">
          <button @click="openEditModal(product)" class="btn btn-secondary flex-1">
            Edit
          </button>
          <button @click="deleteProduct(product.id)" class="btn btn-danger flex-1">
            Delete
          </button>
        </div>
      </div>
      
      <div v-if="products.length === 0" class="col-span-full text-center py-12">
        <div class="text-gray-500">No products found</div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-lg w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Edit Product' : 'Create New Product' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveProduct" class="px-6 py-4 space-y-4">
          <div>
            <label class="form-label">Product Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="form-input"
              placeholder="Enter product name"
            />
          </div>
          
          <div>
            <label class="form-label">Description</label>
            <textarea
              v-model="formData.description"
              required
              rows="3"
              class="form-input"
              placeholder="Enter product description"
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="form-label">Price ($)</label>
              <input
                v-model.number="formData.price"
                type="number"
                step="0.01"
                required
                class="form-input"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label class="form-label">Stock</label>
              <input
                v-model.number="formData.stock"
                type="number"
                required
                class="form-input"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label class="form-label">Category</label>
            <select v-model="formData.category" required class="form-input">
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </form>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="closeModal" type="button" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="saveProduct" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { productApi } from '@/services/api'
import { faro } from '@grafana/faro-web-sdk'
import type { Product } from '@/types'

// Injected global state
const setError = inject<(message: string) => void>('setError')
const globalLoading = inject<any>('loading')

// Component state
const products = ref<Product[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const editingId = ref<number | null>(null)

const formData = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0,
})

// Load products
const loadProducts = async () => {
  try {
    globalLoading.value = true
    const response = await productApi.getAll()
    products.value = response.data.data
    
    // Log successful load
    if (faro) {
      faro.api.pushLog(['Products loaded successfully', products.value.length])
    }
  } catch (error) {
    console.error('Failed to load products:', error)
    setError?.('Failed to load products')
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Products load failed: ${error}`))
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
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
  }
  showModal.value = true
}

// Open edit modal
const openEditModal = (product: Product) => {
  isEditing.value = true
  editingId.value = product.id
  formData.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    stock: product.stock,
  }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  formData.value = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
  }
}

// Save product (create or update)
const saveProduct = async () => {
  try {
    loading.value = true
    
    if (isEditing.value && editingId.value) {
      // Update existing product
      await productApi.update(editingId.value, formData.value)
      
      // Log successful update
      if (faro) {
        faro.api.pushLog(['Product updated successfully', editingId.value])
      }
    } else {
      // Create new product
      await productApi.create(formData.value)
      
      // Log successful creation
      if (faro) {
        faro.api.pushLog(['Product created successfully', formData.value.name])
      }
    }
    
    closeModal()
    await loadProducts() // Reload products list
  } catch (error) {
    console.error('Failed to save product:', error)
    setError?.(`Failed to ${isEditing.value ? 'update' : 'create'} product`)
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Product save failed: ${error}`))
    }
  } finally {
    loading.value = false
  }
}

// Delete product
const deleteProduct = async (id: number) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }
  
  try {
    globalLoading.value = true
    await productApi.delete(id)
    
    // Log successful deletion
    if (faro) {
      faro.api.pushLog(['Product deleted successfully', id])
    }
    
    await loadProducts() // Reload products list
  } catch (error) {
    console.error('Failed to delete product:', error)
    setError?.('Failed to delete product')
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Product deletion failed: ${error}`))
    }
  } finally {
    globalLoading.value = false
  }
}

// Load products on component mount
onMounted(() => {
  loadProducts()
})
</script> 