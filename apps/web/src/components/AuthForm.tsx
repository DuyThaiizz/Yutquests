'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase'

export default function AuthForm() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(`Error: ${error.message}`)
    else setMessage('Check your email for the confirmation link!')
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(`Error: ${error.message}`)
    else setMessage('Logged in successfully!')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-white">Welcome to Yut Nori</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white bg-transparent"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-zinc-900 dark:text-white bg-transparent"
            placeholder="••••••••"
          />
        </div>
        <div className="flex space-x-4 pt-2">
          <button 
            onClick={handleSignIn} 
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            Log In
          </button>
          <button 
            onClick={handleSignUp} 
            disabled={loading}
            className="flex-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">{message}</p>}
    </div>
  )
}