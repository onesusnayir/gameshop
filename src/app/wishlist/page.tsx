'use client'

import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import supabaseClient from "@/lib/supabaseClient";

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  genre: string[];
  image: string;
}

export default function Wishlist(){
    const [games, setGames] = useState<Game[]>([]);
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false)

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
                return;
            }
            const userId = userData?.user?.id;

            // Get Cart
            const { data, error } = await supabaseClient
                .from('wishlist_view')
                .select('game_id, name, description, price, genre, image_filename')
                .eq('user_id', userId);

            if (error) {
                console.error("Error fetching wishlist:", error);
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const gamesWithImages = data?.map((item) => ({
                ...item,
                id: item.game_id,
                image: `${baseUrl}/storage/v1/object/public/games/${item.image_filename}`
            }));
            setGames(gamesWithImages);
        }

        fetchData();
    },[])

    const gamesList = games.map((game) => {
                return(
                    <div key={game.id} className="w-full flex" style={{backgroundColor: 'var(--dark-gray)'}}>
                        <div key={game.id} className="relative w-[300px] h-[200px] cursor-pointer">
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
                                { game && game.genre.length > 0 && 
                                    <div className="flex gap-3 mt-2 text-nowrap">
                                        {game.genre.map((item, index) => <p className="text-white text-sm px-3 py-1 rounded-sm bg-[#626262]" key={index}>{item}</p>)}
                                    </div>
                                }
                                <p className="line-clamp-2 text-sm" style={{color: 'var(--light-gray)'}}>{game.description}</p>
                                <div className="flex gap-5 font-semibold">
                                    <button onClick={() => handleClick(game.id)} className="flex-1 rounded-sm p-2 cursor-pointer" style={{backgroundColor: 'var(--green)'}}>Go to Store</button>
                                    <button onClick={() => handleCart(game.id)} className="flex-1 rounded-sm p-2 cursor-pointer" style={{backgroundColor: 'var(--light-green)'}}>Add to cart</button>
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

    const handleClick = (id: string) => {
        router.push(`/game?id=${id}`);
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
            .from('wishlist')
            .delete()
            .eq('user_id', userId)
            .eq('game_id', game_id);

        if (error) {
            console.error("Error deleting item:", error);
            return;
        }

        setGames(games.filter(item => item.id !== game_id));
    }

    const handleCart = async (game_id: string) => {
        const { data: userData, error: userError } = await supabaseClient.auth.getUser()
        if (userError) {
            console.error("Error fetching user:", userError);
            alert("You should login first");
            return;
        }
        const userId = userData?.user?.id;
        
        const { data, error } = await supabaseClient
            .from('cart')
            .insert({
                game_id: game_id,
                user_id: userId,
            });
            
        if (error) {
            return
        }
    }

    return(
        <div className="min-h-screen flex flex-col" style={{backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
            </header>
            <main className="mt-[60px] flex-1 flex flex-col">
                {
                    isLogin?
                    <div className="p-10">
                        <h1 className="text-white text-2xl font-semibold py-5">Your Wishlist</h1>
                        <div className="flex flex-col gap-3">
                            {games.length > 0 && gamesList}
                        </div>
                    </div>
                    :
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-semibold" style={{color: 'var(--green)'}}>Please Login!</h1>
                        <p className="text-white">Join us and log in to see your wishlist</p>
                    </div>
                }
            </main>
            <Footer/>
        </div>
    )
}