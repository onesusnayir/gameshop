'use client'
import { useEffect, useState } from 'react'
import supabaseClient from '@/lib/supabaseClient'

export default function RegistrasiBerhasil() {
  const [username, setUsername] = useState<string | null>(null)
  const [inserted, setInserted] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const usernameFromUrl = searchParams.get('username')
    setUsername(usernameFromUrl)

    const interval = setInterval(async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      if (!session || !usernameFromUrl || inserted) return

      const auth_id = session.user.id

      const { data, error } = await supabaseClient
        .from('user')
        .insert([{ username: usernameFromUrl, auth_id }])

      if (error) {
        console.error('Gagal insert:', error.message)
      } else {
        console.log('User berhasil ditambahkan:', data)
        setInserted(true)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [inserted])

  return (
    <div className='w-full min-h-[100vh] flex items-center justify-center'>
      <div className='w-[40%] h-auto text-black font-semibold text-4xl rounded-2xl' style={{backgroundColor: 'var(--light-gray)'}}>
        {!inserted? 
          <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          :
          <div>
            <h1>Registrasi Berhasil</h1>
            <p>Selamat datang, {username}!</p>
          </div>
        }
      </div>
    
    </div>
  )
}
