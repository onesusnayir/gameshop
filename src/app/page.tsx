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
  price: number;
  image: string;
}

type Banner = {
    id: string;
    game: {
        id: string,
        name: string;
        description: string;
    };
    image: string;
}

export default function home(){
    const [ games, setGames ] = useState<Game[]>([]);
    const [ banner, setBanner ] = useState<Banner[]>([])

    useEffect(() => {
        const fetchGames = async () => {
            const { data, error } = await supabaseClient
            .from('game_view')
            .select('id, name, price, image_filename')
                if (error) {
                    console.error("Error fetching games:", error);
                    return;
                }

            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const gamesWithImages = data.map((game: any) => ({
            ...game,
            image: `${baseUrl}/storage/v1/object/public/games/${game.image_filename}`
            }));

            setGames(gamesWithImages);
        };

        fetchGames();
    }, []);

    useEffect(() => {
        const fetchBanner = async () => {
            const { data, error } = await supabaseClient
            .from('banner_view')
            .select('id, name, description, image_filename, game_id')

            if(error){
                return console.error(error.message)
            }
            
            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const bannerWithImage = data.map((item) => {
                return {
                    id: item.id,
                    game: {
                        id: item.game_id,
                        name: item.name,
                        description: item.description,
                    },
                    image: `${baseUrl}/storage/v1/object/public/banner/${item.image_filename}`
                }
            })

            setBanner(bannerWithImage)
        }

        fetchBanner()
    }, [])

    return (
        <div className='min-h-[100vh]' style={{ backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
                <div className='mt-[60px]'>
                    {/* <Slider /> */}
                    <Slider banner={banner}/>
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