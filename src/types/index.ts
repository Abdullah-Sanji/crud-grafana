export interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: number
  userId: number
  userName: string
  products: OrderProduct[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface OrderProduct {
  productId: number
  productName: string
  quantity: number
  price: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface ApiError {
  message: string
  code: string
  details?: any
} 