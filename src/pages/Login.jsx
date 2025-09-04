import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useEffect } from "react";
import {jwtDecode} from 'jwt-decode' 

function isTokenExpired(token) {
  if (!token) return true
  try {
    const decoded = jwtDecode(token)
    const now = Date.now() / 1000
    return decoded.exp < now
  } catch {
    return true
  }
}

export default function Login({setToken}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await API.post('/auth/login', {email, password})
      localStorage.setItem('token', res.data.token)
      setToken(res.data.token)
      nav('/tasks')
    } catch (err) {
      console.error(err.response?.data?.error || 'Error logging in')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !isTokenExpired(token)) {
      nav('/tasks')
    } else {
      localStorage.removeItem('token')
    }
  }, [nav])

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
