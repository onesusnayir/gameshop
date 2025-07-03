'use client';
import { useState, useEffect, use } from "react";
import supabaseClient from "@/lib/supabaseClient";
import Image from "next/image";
import Sidebar from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  image: string;
}

export default function GamesPage() {
    const [games, setGames] = useState<Game[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchGames = async () => {
            const { data, error } = await supabaseClient
                .from('game')
                .select('*');

            if (error) {
                console.error("Error fetching games:", error);
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const gamesWithImages = data.map((game) => ({
                ...game,
                image: `${baseUrl}/storage/v1/object/public/games/${game.image}`
            }));

            setGames(gamesWithImages);
        };

        fetchGames();
    }, [])

    const handleClick = (id: string) => {
        router.push(`/game?id=${id}`);
    }

    const gameElements = games.map((game) => {
        return (
            <div onClick={ () => handleClick(game.id)} key={game.id} className="flex cursor-pointer">
                <Image
                src={game.image}
                alt={game.name}
                width={200}
                height={200}
                className="rounded-2xl"/>
                <div className="ml-5">
                    <h2 className="text-xl font-bold text-orange-400">{game.name}</h2>
                    <p className="line-clamp-1">{game.description}</p>
                    <p>{game.price}</p>
                </div>
            </div>
        )
    })
    return(
        <div>
            <Sidebar />
            <div className="ml-[200px] flex flex-col gap-5 p-5">
                {gameElements.length > 0 && gameElements}
            </div>
        </div>
    )
}