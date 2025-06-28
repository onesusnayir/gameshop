'use client'

import { useRouter } from "next/navigation"
import supabaseClient from "@/lib/supabaseClient";

export default function Sidebar() {
    const router = useRouter();

    const handleHome = () => {
        router.push('/'); 
    }
    const handleGames = () => {
        router.push('/games');
    }
    const handleCart = () => {
        router.push('/cart');
    }
    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
            return
        } 
        router.push('/login');
    }
    return (
        <aside className="fixed min-h-[100vh] w-[200px] flex flex-col pt-5 border-r-1 border-orange-400 bg-white justify-between">
            <div className="px-5">
                <h1 className="text-center font-bold text-xl">Game<span className="text-orange-400">Shop</span></h1>
                <ul className="flex flex-col gap-3 mt-10">
                    <li className="flex items-center gap-2 cursor-pointer" onClick={handleHome}><span className="material-symbols-outlined">home</span>Home</li>
                    <li className="flex items-center gap-2 cursor-pointer" onClick={handleGames}><span className="material-symbols-outlined">sports_esports</span>Games</li>
                    <li className="flex items-center gap-2 cursor-pointer" onClick={handleCart}><span className="material-symbols-outlined">shopping_cart</span>Cart</li>
                </ul>
            </div>
            <div onClick={handleLogout} className="h-10 flex items-center text-start border-t-1 border-orange-400 cursor-pointer">
                <span className="material-symbols-outlined text-orange-400 ml-2">account_circle</span>
                <button className="h-full w-full text-start font-semibold text-orange-400 ml-2">Logout</button>
            </div>
      </aside>
    )
}