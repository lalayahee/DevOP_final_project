import React, { useState, useEffect } from 'react'
import { usersAPI } from '../api'

export default function Users() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const r = await usersAPI.list()
      setUsers(r.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function submit() {
    if (!form.name || !form.email) return
    setLoading(true)
    try {
      const resp = await usersAPI.create(form)
      setMsg({ type: 'success', text: `✓ Created user: ${resp.data.name}` })
      setForm({ name: '', email: '' })
      fetchUsers()
      setTimeout(() => setMsg(null), 4000)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || err.message })
      setTimeout(() => setMsg(null), 5000)
    } finally {
      setLoading(false)
    }
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
            👥
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#1a1a1a' }}>User Management</h2>
            <p className="small" style={{ margin: '2px 0 0 0', color: '#666' }}>
              Create and manage system users
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="grid">
        {/* Create User Form */}
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
              Create New User
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name Input */}
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
                  Full Name
                </label>
                <input
                  required
                  placeholder="Enter full name..."
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.95rem',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0b5cff'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>

              {/* Email Input */}
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
                  <span style={{ fontSize: '1rem' }}>📧</span>
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.95rem',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0b5cff'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>

              {/* Preview Box */}
              {(form.name || form.email) && (
                <div style={{
                  background: 'linear-gradient(135deg, #e6f0ff 0%, #f0f7ff 100%)',
                  border: '2px solid #0b5cff',
                  padding: '16px',
                  borderRadius: '10px',
                  marginTop: '4px'
                }}>
                  <div style={{
                    fontWeight: 700,
                    marginBottom: '10px',
                    color: '#0340a6',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>👁️</span> Preview
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#0340a6', lineHeight: '1.8' }}>
                    {form.name && (
                      <div style={{ marginBottom: '4px' }}>
                        <strong>Name:</strong> {form.name}
                      </div>
                    )}
                    {form.email && (
                      <div>
                        <strong>Email:</strong> {form.email}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={submit}
                disabled={loading || !form.name || !form.email}
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
                  boxShadow: loading || !form.name || !form.email ? 'none' : '0 4px 12px rgba(11, 92, 255, 0.3)'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>
                  {loading ? '⏳' : '✨'}
                </span>
                {loading ? 'Creating User...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
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
              <span style={{ fontSize: '1.3rem' }}>📋</span>
              Existing Users
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
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </div>
          </div>

          <div style={{ maxHeight: '620px', overflowY: 'auto', paddingRight: '4px' }}>
            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#fafafa',
                borderRadius: '12px',
                border: '1px solid #eee'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f0f0f0',
                  borderTop: '4px solid #0b5cff',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p className="small" style={{ color: '#999' }}>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
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
                }}>👥</div>
                <p style={{
                  color: '#999',
                  margin: '0 0 8px 0',
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}>
                  No users yet
                </p>
                <p className="small" style={{ color: '#bbb', margin: 0 }}>
                  Create your first user using the form
                </p>
              </div>
            ) : (
              users.map((u, index) => (
                <div
                  className="card"
                  key={u._id}
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
                    paddingRight: index === 0 ? '60px' : '0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'linear-gradient(135deg, #0b5cff 0%, #0a4fd6 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(11, 92, 255, 0.3)'
                      }}>
                        👤
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#1a1a1a',
                          marginBottom: '2px'
                        }}>
                          {u.name}
                        </div>
                        <div style={{
                          fontSize: '0.9rem',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ fontSize: '0.85rem' }}>📧</span>
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      paddingTop: '10px',
                      borderTop: '1px solid ' + (index === 0 ? '#b8d4ff' : '#f0f0f0')
                    }}>
                      <div className="small" style={{
                        color: '#999',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>🔑</span>
                        <span>ID: {u._id}</span>
                      </div>
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