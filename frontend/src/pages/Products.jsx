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
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #0b5cff',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading orders...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #0b5cff 0%, #0a4fd6 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            🛒
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#1a1a1a' }}>Order Management</h2>
            <p className="small" style={{ margin: '2px 0 0 0', color: '#666' }}>
              Create and track customer orders
            </p>
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {msg && (
        <div 
          className={"banner " + (msg.type === 'success' ? 'banner-success' : 'banner-error')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.95rem',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>
            {msg.type === 'success' ? '✓' : '✕'}
          </span>
          {msg.text}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="grid">
        {/* Order Form */}
        <div>
          <div style={{ 
            background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: '20px',
              fontSize: '1.2rem',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.3rem' }}>➕</span>
              Create New Order
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* User Selection */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '1rem' }}>👤</span>
                  Customer
                </label>
                <select
                  required
                  value={form.userId}
                  onChange={e => setForm({ ...form, userId: e.target.value })}
                  style={{ 
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    background: '#fff'
                  }}
                >
                  <option value="">Select a customer...</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
                {selectedUser && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: '#e6f0ff',
                    border: '1px solid #cfe0ff',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#0340a6'
                  }}>
                    <strong>✓</strong> {selectedUser.name} • {selectedUser.email}
                  </div>
                )}
              </div>

              {/* Product Selection */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '1rem' }}>📦</span>
                  Product
                </label>
                <select
                  required
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  style={{ 
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    background: '#fff'
                  }}
                >
                  <option value="">Select a product...</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} - ${p.price}
                    </option>
                  ))}
                </select>
                {selectedProduct && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: '#e6f0ff',
                    border: '1px solid #cfe0ff',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#0340a6'
                  }}>
                    <strong>✓</strong> {selectedProduct.name} • ${selectedProduct.price}
                  </div>
                )}
              </div>

              {/* Order Preview */}
              {selectedUser && selectedProduct && (
                <div style={{
                  background: 'linear-gradient(135deg, #e6f0ff 0%, #f0f7ff 100%)',
                  border: '2px solid #0b5cff',
                  padding: '16px',
                  borderRadius: '10px',
                  marginTop: '4px'
                }}>
                  <div style={{ 
                    fontWeight: 700, 
                    marginBottom: '12px', 
                    color: '#0340a6',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>📋</span> Order Preview
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#0340a6', lineHeight: '1.8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span><strong>Customer:</strong></span>
                      <span>{selectedUser.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span><strong>Email:</strong></span>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span><strong>Product:</strong></span>
                      <span>{selectedProduct.name}</span>
                    </div>
                    <div style={{
                      paddingTop: '12px',
                      borderTop: '2px solid #b8d4ff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Amount:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0b5cff' }}>
                        ${selectedProduct.price}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={submit}
                disabled={loading || !form.userId || !form.productId}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  marginTop: '8px',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: loading || !form.userId || !form.productId ? 'none' : '0 4px 12px rgba(11, 92, 255, 0.3)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>
                  {loading ? '⏳' : '🛒'}
                </span>
                {loading ? 'Creating Order...' : 'Create Order'}
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '0 4px'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.2rem',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.3rem' }}>📊</span>
              Recent Orders
            </h3>
            <div style={{
              background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#555',
              border: '1px solid #ddd'
            }}>
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </div>
          </div>

          <div style={{ maxHeight: '620px', overflowY: 'auto', paddingRight: '4px' }}>
            {orders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%)',
                borderRadius: '12px',
                border: '2px dashed #ddd'
              }}>
                <div style={{ 
                  fontSize: '4rem', 
                  marginBottom: '16px',
                  opacity: 0.3
                }}>📭</div>
                <p style={{ 
                  color: '#999', 
                  margin: '0 0 8px 0',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>
                  No orders yet
                </p>
                <p className="small" style={{ color: '#bbb', margin: 0 }}>
                  Create your first order using the form
                </p>
              </div>
            ) : (
              orders.map((o, index) => (
                <div
                  className="card"
                  key={o._id}
                  style={{
                    background: index === 0 
                      ? 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)' 
                      : '#fff',
                    border: index === 0 ? '2px solid #0b5cff' : '1px solid #e8e8e8',
                    position: 'relative',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    boxShadow: index === 0 ? '0 4px 12px rgba(11, 92, 255, 0.15)' : '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                  onMouseEnter={e => {
                    if (index !== 0) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={e => {
                    if (index !== 0) e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  {index === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'linear-gradient(135deg, #0b5cff 0%, #0a4fd6 100%)',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 6px rgba(11, 92, 255, 0.4)'
                    }}>
                      NEW
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                    paddingRight: index === 0 ? '60px' : '0'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: 700, 
                        fontSize: '1.1rem', 
                        marginBottom: '4px',
                        color: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>📦</span>
                        {o.productName}
                      </div>
                      <div className="small" style={{ color: '#999' }}>
                        ID: {o._id}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#0b5cff',
                      background: 'rgba(11, 92, 255, 0.1)',
                      padding: '4px 12px',
                      borderRadius: '8px'
                    }}>
                      ${o.productPrice}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 0 0 0',
                    borderTop: '1px solid ' + (index === 0 ? '#b8d4ff' : '#f0f0f0')
                  }}>
                    <div className="small" style={{ 
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#555'
                    }}>
                      <span style={{ fontSize: '1rem' }}>👤</span>
                      <span>User ID: {o.userId}</span>
                    </div>
                    <div className="small" style={{ 
                      color: '#999',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontSize: '1rem' }}>🕒</span>
                      <span>
                        {new Date(o.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
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