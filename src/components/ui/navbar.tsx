'use client'

import supabaseClient from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  username: string;
}


export default function Navbar () {
    const [ user, setUser ] = useState<User>()

    useEffect(() => {
        const fetchSession = async () => {
            const {data , error } = await supabaseClient.auth.getUser()

            if (error) {
                console.error('Gagal mengambil sesi:', error)
                return
            }
            if (data) {
                console.log(data)
            } 
            const {data: userData , error: usernameError} = await supabaseClient
            .from('user')
            .select('id, username')
            .eq('auth_id',data.user.id)
            .single();

            if(!usernameError){
                setUser(userData)
            }
        }

        fetchSession()
    }, [])

    const router = useRouter()
    const handleLogin = () => {
        router.push('/login')
    }
    const handleHome = () => {
        router.push('/')
    }
    const handleGames = () => {
        router.push('/games')
    }
    // const handleWishlist = () => {
    //     router.push('/login')
    // }
    const handleCart = () => {
        router.push('/cart')
    }
    return(
        <nav className="max-h-[60px] fixed top-0 z-50 w-full p-5 flex gap-5 text-white items-center justify-around" style={{ backgroundColor: '#000000' }}>
            <Image 
            src={'/icon.svg'}
            width={50}
            height={50}
            alt='icon'
            className="w-[30px] h-[30px]"/>
            <ul className="grow max-w-[500px] flex justify-around">
                <li onClick={handleHome} ><button className="cursor-pointer">Home</button></li>
                <li onClick={handleGames}><button className="cursor-pointer">Game</button></li>
                <li  className=""><button>Wishlist</button></li>
                <li onClick={handleCart}><button className="cursor-pointer">Cart</button></li>
            </ul>
            <div className="flex min-w-[300px] rounded-sm items-center" style={{ backgroundColor: 'var(--dark-gray)' }}>
                <button className="text-xl flex items-center cursor-pointer">
                    <span className="material-symbols-outlined text-white text-xl ml-4">search</span>
                </button>
                <input className="grow px-4 py-2 border-none outline-none rounded-sm" type="text" placeholder="Search"/>
            </div>
            {user ? 
            <p>{user.username}</p>
            :
            <button onClick={handleLogin} className="px-6 py-2 rounded-sm text-black cursor-pointer" style={{ backgroundColor: 'var(--green)'}}>Log in</button>
            }
        </nav>
    )
}