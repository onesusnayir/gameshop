'use client'

import Navbar from "@/components/ui/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabaseClient from "@/lib/supabaseClient";
import Image from "next/image";

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  image: string;
}

export default function cartPage(){
    const [games, setGames] = useState<Game[]>([]);
    const [isLogin, setIsLogin] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabaseClient.auth.getSession()
            if (session) {
                setIsLogin(true)
            }
        }

        checkSession()
    }, [])


    useEffect(() => {
        const fetchData = async () => {
            // Get Id User
            const { data: userData, error: userError } = await supabaseClient.auth.getUser()
            if (userError) {
                console.error("Error fetching user:", userError);
                return;
            }
            const userId = userData?.user?.id;

            // Get Cart
            const { data, error } = await supabaseClient
                .from('cart')
                .select('*')
                .eq('user_id', userId);
            if (error) {
                console.error("Error fetching cart:", error);
                return;
            }
            // Get Game
            const { data: gameData, error: gameError } = await supabaseClient
                .from('game_with_image')
                .select('*')
                .in('id', data.map((item: any) => item.game_id));
                
                            if (gameError) {
                                console.error("Error fetching games:", gameError);
                                return;
                            }

            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const gamesWithImages = gameData?.map((game) => ({
                ...game,
                image: `${baseUrl}/storage/v1/object/public/games/${game.image}`
            }));
            setGames(gamesWithImages);
        }

        fetchData();
    },[])

    const handleClick = (id: string) => {
        router.push(`/game?id=${id}`);
    }

    const gamesList = games.map((game) => {
            return(
                <div key={game.id} className="w-full flex" style={{backgroundColor: 'var(--dark-gray)'}}>
                    <div key={game.id} onClick={() => handleClick(game.id)} className="relative w-[300px] h-[200px] cursor-pointer">
                        <Image 
                        src={game.image} 
                        alt={game.name} 
                        fill
                        className="object-cover"
                        />
                    </div>
                    <div className="flex p-5 w-full justify-between">
                        <div className="grow max-w-[450px] flex flex-col justify-start gap-3">
                            <h1 className="text-white text-3xl ">{game.name}</h1>
                            <p className="line-clamp-2 text-sm" style={{color: 'var(--light-gray)'}}>{game.description}</p>
                            <div className="flex gap-5">
                                <button onClick={() => handleClick(game.id)} className="rounded-sm py-2 px-4 cursor-pointer" style={{backgroundColor: 'var(--green)'}}>Go to Store</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-end">
                            <button onClick={() => handleDeleteItem(game.id)} className="mb-auto cursor-pointer">
                                <span className="material-symbols-outlined text-white text-xl ml-4">close</span>
                            </button>
                            <p className="text-2xl" style={{color: 'var(--green)'}}>{'Rp '+game.price}</p>
                        </div>
                    </div>
                </div>
            )
        })

    const handleItemsClick = (game_id : string) => {
        router.push(`/game?id=${game_id}`);
    }

    const handleDeleteItem = async (game_id: string) => {
        // Get Id User
        const { data: userData, error: userError } = await supabaseClient.auth.getUser()
        if (userError) {
            console.error("Error fetching user:", userError);
            return;
        }
        const userId = userData?.user?.id;

        // Delete Item
        const { error } = await supabaseClient
            .from('cart')
            .delete()
            .eq('user_id', userId)
            .eq('game_id', game_id);

        if (error) {
            console.error("Error deleting item:", error);
            return;
        }

        // Refresh Cart
        setGames(games.filter(item => item.id !== game_id));
    }

    return (
        <div className="min-h-screen flex flex-col" style={{backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
            </header>
            {
                isLogin ?
                <main className="flex-1 flex-col flex mt-[60px]">
                    <div className="p-10 flex flex-col flex-1 items-center gap-3">
                        <h1 className="text-white font-semibold text-2xl mb-5 w-full text-start">Your Cart</h1>
                        {games.length > 0 && gamesList}
                    </div>
                    <footer className="bg-black p-5 flex justify-between items-center">
                        <h1 className="text-white">{'Total '+games.length+' items'}</h1>
                        <div className="flex gap-5">
                            <div>
                                <p className="text-white">Total Price</p>
                                <p style={{color: 'var(--green)'}}>{+games.length > 0 ? 'Rp '+games.reduce((acc, game) => acc + game.price, 0) : 'Rp '+0}</p>
                            </div>
                            <button className="color-white rounded-sm px-4" style={{backgroundColor: 'var(--green)'}}>Pay Now</button>
                        </div>
                    </footer>
                </main>
                :
                <main className="pt-[60px] h-full flex flex-col justify-center flex-1">
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <h2 className="text-xl font-semibold" style={{color: 'var(--green)'}}>Please Login</h2>
                        <p className="text-white">Join us and log in to see your cart</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative w-[383px] h-[33px]">
                            <Image
                                src={'/copyright.png'}
                                fill
                                alt="copyright"/>
                        </div>
                    </div>
                </main>
            }
        </div>
    )
}