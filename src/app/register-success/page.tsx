'use client'
import { useEffect, useState } from 'react'
import supabaseClient from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import AuthFooter from '@/components/ui/authFooter'

export default function RegistrasiBerhasil() {
  const [username, setUsername] = useState<string | null>(null)
  const [inserted, setInserted] = useState(false)
  const router = useRouter()

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
        setInserted(true)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [inserted])

  const loginHandler = () => {
    router.push('/login')
  }

  return (
    <div className='w-full h-screen flex'>
      <div className='w-[550px] h-full flex flex-col' style={{backgroundColor: 'var(--gray)'}}>
        
        {!inserted? 
          <div className='flex-1 flex justify-center items-center'>
            <svg className="animate-spin h-20 w-20" viewBox="0 0 24 24" style={{color: 'var(--green)'}}>
              <path fill="currentColor" className="opacity-60" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
          </div>
          :
          <div className='p-10 flex-1 flex flex-col items-start justify-center'>
            <h1 className='text-2xl font-semibold' style={{color: 'var(--green)'}}>Success</h1>
            <p className='text-white'>
              Your account has successfully created, thanks for 
              joining us, dive in & explore 100.000+ games!
            </p>
            <button onClick={loginHandler} className='w-full py-1 mt-5 rounded cursor-pointer' style={{backgroundColor: 'var(--green)'}}>BACK TO LOGIN</button>
          </div>
        }
        <AuthFooter/>
      </div>
      <div className='flex-1 bg-cover bg-center' style={{backgroundImage: 'url(/games_bg.jpg)'}}></div>
    </div>
  )
}
