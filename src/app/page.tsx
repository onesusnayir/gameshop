'use client';

import Slider from '@/components/ui/slider'
import Navbar from '@/components/ui/navbar'
import GameSlider from '@/components/ui/gamesSlider'
import Footer from '@/components/ui/footer';
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
            .from('game_with_image')
            .select('*')
                if (error) {
                    console.error("Error fetching games:", error);
                    return;
                }

            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const gamesWithImages = data.map((game: any) => ({
            ...game,
            image: `${baseUrl}/storage/v1/object/public/games/${game.image}`
            }));

            setGames(gamesWithImages);
        };

        fetchGames();
    }, []);

    return (
        <div className='min-h-[100vh]' style={{ backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
                <div className='mt-[60px]'>
                    {/* <Slider /> */}
                    <Slider games={games}/>
                </div>
            </header>
            <main className='mt-10 px-5'>
                <h2 className='text-white text-2xl font-bold m-3'>Our Featured Games</h2>
                <div className='flex gap-5 p-5'>
                    {
                        games.length > 0 && <GameSlider games={games}/>
                    }
                </div>
            </main>
            <Footer />
        </div>
    )
}