import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Products from './pages/Products'
import Users from './pages/Users'
import Orders from './pages/Orders'
import './styles.css'

function App(){
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>Microservices E-Commerce</h1>
          <nav>
            <Link to="/">Products</Link>
            <Link to="/users">Users</Link>
            <Link to="/orders">Orders</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Products/>} />
            <Route path="/users" element={<Users/>} />
            <Route path="/orders" element={<Orders/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
