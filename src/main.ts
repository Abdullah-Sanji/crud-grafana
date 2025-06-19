import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import { initializeFaro } from './plugins/faro'

// Import views
import Home from './views/Home.vue'
import Users from './views/Users.vue'
import Products from './views/Products.vue'
import Orders from './views/Orders.vue'

// Initialize Faro monitoring
initializeFaro()

// Define routes
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/users', name: 'Users', component: Users },
  { path: '/products', name: 'Products', component: Products },
  { path: '/orders', name: 'Orders', component: Orders },
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app') 