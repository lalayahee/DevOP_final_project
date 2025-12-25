import axios from 'axios'

const USER_URL = import.meta.env.VITE_USER_URL || 'http://localhost:3001'
const PRODUCT_URL = import.meta.env.VITE_PRODUCT_URL || 'http://localhost:3002'
const ORDER_URL = import.meta.env.VITE_ORDER_URL || 'http://localhost:3003'

export const usersAPI = {
  list: () => axios.get(`${USER_URL}/users`),
  create: (data) => axios.post(`${USER_URL}/users`, data),
  get: (id) => axios.get(`${USER_URL}/users/${id}`)
}

export const productsAPI = {
  list: () => axios.get(`${PRODUCT_URL}/products`),
  create: (data) => axios.post(`${PRODUCT_URL}/products`, data),
  get: (id) => axios.get(`${PRODUCT_URL}/products/${id}`)
}

export const ordersAPI = {
  list: () => axios.get(`${ORDER_URL}/orders`),
  create: (data) => axios.post(`${ORDER_URL}/orders`, data),
  get: (id) => axios.get(`${ORDER_URL}/orders/${id}`)
}
