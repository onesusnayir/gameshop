'use client';
import { useState, useEffect, use } from "react";
import supabaseClient from "@/lib/supabaseClient";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  genre: string[];
  image: string;
}

export default function GamesPage() {
    const [games, setGames] = useState<Game[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchGames = async () => {
            const { data, error } = await supabaseClient
                .from('game_view')
                .select('id, name, description, price, image_filename, genre');

            if (error) {
                console.error("Error fetching games:", error);
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const gamesWithImages = data.map((game) => ({
                ...game,
                image: `${baseUrl}/storage/v1/object/public/games/${game.image_filename}`
            }));

            setGames(gamesWithImages);
        };

        fetchGames();
    }, [])

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
                    <div className="grow max-w-[450px] flex flex-col justify-center gap-3">
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
                    <div className="p-5 flex flex-col items-end justify-end">
                        <button onClick={() => handleWishlist(game.id)} className="text-white cursor-pointer">add to wishlist</button>
                        <p className="text-2xl" style={{color: 'var(--green)'}}>{'Rp '+game.price}</p>
                    </div>
                </div>
            </div>
        )
    })

    const handleClick = (id: string) => {
        router.push(`/game?id=${id}`);
    }

    const handleCart = async (game_id: string) => {
        const { data: userData, error: userError } = await supabaseClient.auth.getUser()
        if (userError) {
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

    const handleWishlist = async(game_id: string) => {
        const { data: userData, error: userError } = await supabaseClient.auth.getUser()
        if (userError) {
            alert("You should login first");
            return;
        }
        const userId = userData?.user?.id;
        
        const { data, error } = await supabaseClient
            .from('wishlist')
            .insert({
                game_id: game_id,
                user_id: userId,
            });
            
        if (error) {
            return
        }
    }
    return(
        <div className="min-h-[100vh] w-full" style={{backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
            </header>
            <main className="mt-[60px] pt-5 px-10">
                <h1 className="text-white font-semibold text-2xl mb-5">All Games</h1>
                <div className="flex flex-col items-center gap-3">
                    {games.length > 0 && gamesList}
                </div>
            </main>
            <Footer />
        </div>
    )
}