import React, { useEffect, useState } from 'react'
import { ordersAPI, productsAPI } from '../api'

export default function Orders() {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ userId: '', productId: '' })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setInitialLoading(true)
    await Promise.all([fetchProducts(), fetchUsers(), fetchOrders()])
    setInitialLoading(false)
  }

  async function fetchProducts() {
    try {
      const r = await productsAPI.list()
      setProducts(r.data)
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchUsers() {
    try {
      const r = await fetch('/api/proxy/users')
    } catch (e) {}
    try {
      const r = await (await import('../api')).usersAPI.list()
      setUsers((await r).data)
    } catch (e) {
      console.error(e)
    }
  }

  async function fetchOrders() {
    try {
      const r = await ordersAPI.list()
      setOrders(r.data)
    } catch (e) {
      console.error(e)
    }
  }

  async function submit() {
    if (!form.userId || !form.productId) return
    setLoading(true)
    try {
      const r = await ordersAPI.create(form)
      setOrders([r.data, ...orders])
      setForm({ userId: '', productId: '' })
      setMsg({ type: 'success', text: '✓ Order created successfully!' })
      setTimeout(() => setMsg(null), 3500)
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || e.message })
      setTimeout(() => setMsg(null), 4000)
    } finally {
      setLoading(false)
    }
  }

  const selectedProduct = products.find(p => p._id === form.productId)
  const selectedUser = users.find(u => u._id === form.userId)

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
        <p style={{ color: '#666' }}>Loading orders...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{ fontSize: '1.5rem' }}>🛒</span>
        <h2 style={{ margin: 0 }}>Order Management</h2>
      </div>

      {msg && (
        <div className={"banner " + (msg.type === 'success' ? 'banner-success' : 'banner-error')}>
          {msg.text}
        </div>
      )}

      <div className="grid">
        {/* Order Form */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> Create New Order
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* User Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>
                👤 Customer
              </label>
              <select
                required
                value={form.userId}
                onChange={e => setForm({ ...form, userId: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">Select user...</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {selectedUser && (
                <div className="small" style={{ marginTop: '6px', color: '#0b5cff' }}>
                  ✓ Selected: {selectedUser.name}
                </div>
              )}
            </div>

            {/* Product Selection */}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '0.9rem' }}>
                📦 Product
              </label>
              <select
                required
                value={form.productId}
                onChange={e => setForm({ ...form, productId: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">Select product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} (${p.price})
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <div className="small" style={{ marginTop: '6px', color: '#0b5cff' }}>
                  ✓ Selected: {selectedProduct.name} - ${selectedProduct.price}
                </div>
              )}
            </div>

            {/* Order Preview */}
            {selectedUser && selectedProduct && (
              <div style={{
                background: '#e6f0ff',
                border: '1px solid #cfe0ff',
                padding: '16px',
                borderRadius: '6px'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '10px', color: '#0340a6' }}>
                  📋 Order Preview
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0340a6', lineHeight: '1.6' }}>
                  <div><strong>Customer:</strong> {selectedUser.name}</div>
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Product:</strong> {selectedProduct.name}</div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid #cfe0ff'
                  }}>
                    Total: ${selectedProduct.price}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={submit}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1rem', padding: '12px' }}
            >
              {loading ? '⏳ Creating Order...' : '🛒 Create Order'}
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📊</span> Recent Orders
            </h3>
            <span style={{
              background: '#f0f0f0',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#666'
            }}>
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {orders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                background: '#fafafa',
                borderRadius: '8px',
                border: '1px dashed #ddd'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.5 }}>📭</div>
                <p style={{ color: '#999', margin: 0 }}>No orders yet</p>
                <p className="small" style={{ color: '#bbb', marginTop: '4px' }}>
                  Create your first order using the form
                </p>
              </div>
            ) : (
              orders.map((o, index) => (
                <div
                  className="card"
                  key={o._id}
                  style={{
                    background: index === 0 ? '#f8fbff' : '#fff',
                    border: index === 0 ? '2px solid #0b5cff' : '1px solid #eee',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  {index === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#0b5cff',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      NEW
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '4px' }}>
                        📦 {o.productName}
                      </div>
                      <div className="small" style={{ color: '#999' }}>
                        Order #{o._id}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      color: '#0b5cff'
                    }}>
                      ${o.productPrice}
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 0',
                    borderTop: '1px solid #f0f0f0',
                    marginTop: '8px'
                  }}>
                    <div className="small" style={{ marginBottom: '4px' }}>
                      <span style={{ opacity: 0.7 }}>👤</span> User ID: {o.userId}
                    </div>
                    <div className="small" style={{ color: '#999' }}>
                      <span style={{ opacity: 0.7 }}>🕒</span> {new Date(o.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}