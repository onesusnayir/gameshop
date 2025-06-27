'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import supabaseClient from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Sidebar from "@/components/ui/sidebar";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  image: string;
}

export default function Home() {
  const [ games, setGames ] = useState<Game[]>([]);
  const router = useRouter()

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

  const handleBuy = (id : string) => {
    router.push(`/game?id=${id}`)
  }

  const gameCards = games.map((game) => {
    return (
      <div key={game.id} className="flex flex-col items-center justify-center">
        <Image
          src={game.image}
          alt={game.name}
          width={200}
          height={200}
          className="w-[150px] h-[150px] object-cover rounded-2xl"/>
        <h1 className="font-bold text-lg mt-2">{game.name}</h1>
        <p className="text-sm">Developer: {game.developer}</p>
        <p className="text-sm">Price: ${game.price}</p>
        <button 
        className="text-sm bg-orange-400 py-0.5 px-5 rounded-2xl mt-2 font-semibold"
        onClick={ () => {handleBuy(game.id)} }
        >Add to Cart</button>
      </div>
    )
  })

  // Swiper component for the slider
  const swiper = games.map((game) => {
    return(
      <SwiperSlide key={game.id}>
        <Image
              src={game.image}
              alt={game.name}
              width={300}
              height={200}
              className="w-[200px] h-[200px] object-cover rounded-2xl"/>
      </SwiperSlide>
    )
  })

  return (
    <div className="flex">
      {/* ||  Sidebar */}
      <Sidebar />

      {/* || Main Content */}
      <div className="ml-[200px] flex flex-col w-full">
        {/* Slider */}
        {
          games.length > 0 && (
            <header className="w-full p-10 flex justify-center">
                <Image 
                  src={games[2].image}
                  alt="Game Banner"
                  width={500}
                  height={300}
                  className="rounded-xl"/>
            </header>
          )
        }

          {/* || Game Grid */}
          { games.length > 0 && (
            <div className="mb-20">
              <h1 className="p-3 text-lg font-bold text-orange-400">Games</h1>
              <div className="grid grid-cols-4 gap-y-10">
                {gameCards}
            </div>
          </div>
          )}
      </div>
    </div>
  );
}
