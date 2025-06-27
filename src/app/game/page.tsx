'use client'

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, use } from "react";
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Sidebar from '@/components/ui/sidebar';
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

export default function GamePage() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const [ game, setGame ] = useState<Game>();
    const router = useRouter()

    useEffect(() => {
        const fetchGame = async () => {
            const { data, error } = await supabaseClient
                .from('game')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching game:", error);
                return
            }
            setGame(data);
        }

        fetchGame();
    },[])

    const handleBuy = () => {
        router.push(`/checkout?id=${game?.id}`);
    }

    const handleCart = async () => {
        const { data: userData, error: userError } = await supabaseClient.auth.getUser()
        if (userError) {
            console.error("Error fetching user:", userError);
            return;
        }
        const userId = userData?.user?.id;
        console.log("User:", userId)
        console.log("Game:", game)
        const { data, error } = await supabaseClient
            .from('cart')
            .insert({
                game_id: game?.id,
                user_id: userId,
            });
            
        if (error) {

            return
        }
    }
    return (
        <div>
      {/* ||  Sidebar */}
      <Sidebar />

      {/* || Main Content */}
        {game && (
            <div className='ml-[200px] px-10 pt-5'>
                <h1 className="text-2xl font-bold">{game.name}</h1>
                <p className="text-sm">Developer: {game.developer}</p>
                <Image 
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/games/${game.image}`} 
                    alt={game.name} 
                    width={400}
                    height={300}
                    className="w-[600px] h-[300px] rounded-2xl mt-4 object-cover"
                />
                <p className="mt-4">{game.description}</p>
                <p className="text-sm">Price: ${game.price}</p>
                <div className='flex gap-5'>
                    <button 
                        className="text-sm bg-orange-400 py-0.5 px-5 rounded-2xl mt-2 font-semibold"
                        onClick={ handleBuy }>Buy</button>
                    <button 
                        className="text-sm bg-orange-400 py-0.5 px-5 rounded-2xl mt-2 font-semibold"
                        onClick={ handleCart }>Add to cart</button>
                </div>
            </div>
        )}
    </div>
    )
}