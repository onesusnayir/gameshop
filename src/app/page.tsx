'use client';

import Slider from '@/components/ui/slider'
import Navbar from '@/components/ui/navbar'
import Image from "next/image";
import supabaseClient from '@/lib/supabaseClient';
import { useState, useEffect } from 'react'

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  image: string;
}

export default function home(){
    const [ games, setGames ] = useState<Game[]>([]);

    useEffect(() => {
        const fetchGames = async () => {
        const { data, error } = await supabaseClient
            .from('game')
            .select('*')
            .range(0, 3);

        if (error) {
            console.error("Error fetching games:", error);
            return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const gamesWithImages = data.map((game: Game) => ({
            ...game,
            image: `${baseUrl}/storage/v1/object/public/games/${game.image}`
        }))

        setGames(gamesWithImages)
        }

        fetchGames()
    }, []);

    const gamesGrid = games.map((game) => {
        return(
            <div key={game.id} className="relative h-[300px] w-[200px] bg-no-repeat bg-cover flex flex-col justify-end" style={{ backgroundImage: `url(${game.image})` }}>
                <div className="absolute bottom-12 left-0 w-full h-10 bg-gradient-to-t from-[#1D1D1D] to-transparent z-10" />
                <div className='relative h-[50px] p-4 z-20' style={{ backgroundColor: 'var(--gray)'}}>
                    <h1 className='font-semibold text-[14px] text-white text-nowrap'>{game.name}</h1>
                    <p className='text-[12px] text-white'>{'Rp '+game.price}</p>
                </div>
            </div>
        )
    })

    return (
        <div style={{ backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
                <div>
                    {/* <Slider /> */}
                    <Slider games={games}/>
                </div>
            </header>
            <main className='mt-10 px-5'>
                <h2 className='text-white text-2xl font-bold m-3'>Our Featured Games</h2>
                <div className='flex gap-5 p-5'>
                    {
                        games.length > 0 && gamesGrid
                    }
                </div>
            </main>
        </div>
    )
}