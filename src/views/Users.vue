<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        Add New User
      </button>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="openEditModal(user)" class="text-indigo-600 hover:text-indigo-900">
                  Edit
                </button>
                <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="users.length === 0" class="text-center py-12">
          <div class="text-gray-500">No users found</div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Edit User' : 'Create New User' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveUser" class="px-6 py-4 space-y-4">
          <div>
            <label class="form-label">Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="form-input"
              placeholder="Enter user name"
            />
          </div>
          
          <div>
            <label class="form-label">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="form-input"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label class="form-label">Role</label>
            <select v-model="formData.role" required class="form-input">
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </form>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button @click="closeModal" type="button" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="saveUser" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { userApi } from '@/services/api'
import { faro } from '@grafana/faro-web-sdk'
import type { User } from '@/types'

// Injected global state
const setError = inject<(message: string) => void>('setError')
const globalLoading = inject<any>('loading')

// Component state
const users = ref<User[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const loading = ref(false)
const editingId = ref<number | null>(null)

const formData = ref({
  name: '',
  email: '',
  role: '',
})

// Load users
const loadUsers = async () => {
  try {
    globalLoading.value = true
    const response = await userApi.getAll()
    users.value = response.data.data
    
    // Log successful load
    if (faro) {
      faro.api.pushLog(['Users loaded successfully', users.value.length])
    }
  } catch (error) {
    console.error('Failed to load users:', error)
    setError?.('Failed to load users')
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`Users load failed: ${error}`))
    }
  } finally {
    globalLoading.value = false
  }
}

// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = { name: '', email: '', role: '' }
  showModal.value = true
}

// Open edit modal
const openEditModal = (user: User) => {
  isEditing.value = true
  editingId.value = user.id
  formData.value = {
    name: user.name,
    email: user.email,
    role: user.role,
  }
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  formData.value = { name: '', email: '', role: '' }
}

// Save user (create or update)
const saveUser = async () => {
  try {
    loading.value = true
    
    if (isEditing.value && editingId.value) {
      // Update existing user
      await userApi.update(editingId.value, formData.value)
      
      // Log successful update
      if (faro) {
        faro.api.pushLog(['User updated successfully', editingId.value])
      }
    } else {
      // Create new user
      await userApi.create(formData.value)
      
      // Log successful creation
      if (faro) {
        faro.api.pushLog(['User created successfully', formData.value.email])
      }
    }
    
    closeModal()
    await loadUsers() // Reload users list
  } catch (error) {
    console.error('Failed to save user:', error)
    setError?.(`Failed to ${isEditing.value ? 'update' : 'create'} user`)
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`User save failed: ${error}`))
    }
  } finally {
    loading.value = false
  }
}

// Delete user
const deleteUser = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user?')) {
    return
  }
  
  try {
    globalLoading.value = true
    await userApi.delete(id)
    
    // Log successful deletion
    if (faro) {
      faro.api.pushLog(['User deleted successfully', id])
    }
    
    await loadUsers() // Reload users list
  } catch (error) {
    console.error('Failed to delete user:', error)
    setError?.('Failed to delete user. This action has a 30% chance of failing for demo purposes.')
    
    // Log error with Faro
    if (faro) {
      faro.api.pushError(new Error(`User deletion failed: ${error}`))
    }
  } finally {
    globalLoading.value = false
  }
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Load users on component mount
onMounted(() => {
  loadUsers()
})
</script> 