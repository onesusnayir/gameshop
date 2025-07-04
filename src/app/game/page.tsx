'use client'

import { useState, useEffect, use } from "react";
import { useRouter } from 'next/navigation'
import Navbar from "@/components/ui/navbar";
import supabaseClient from "@/lib/supabaseClient";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Image from "next/image";

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  image: string;
}

type Banner = {
    id: string;
    image: string;
}

type Genre = {
    id: string;
    genre: string;
}

export default function GamePage() {
    const [id, setId] = useState<string | null>(null);
    const [ game, setGame ] = useState<Game>();
    const [ banner, setBanner] = useState<Banner[]>([])
    const [genre, setGenre] = useState<Genre[]>([])
    const router = useRouter()
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    useEffect(() => {
    if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        const gameId = searchParams.get('id');
        setId(gameId);
    }
    }, []);

    useEffect(() => {
            if (!id) return;
            const fetchGame = async () => {
            const { data: gameData, error: dataGameError } = await supabaseClient
            .from('game_with_image')
            .select('*')
            .eq('id', id)
            .single()

            if (dataGameError) {
                console.error("Error fetching games:", dataGameError.message);
                return;
            }
            
            const gameWithImage = {
                ...gameData,
                image:  `${baseUrl}/storage/v1/object/public/games/${gameData.image}`
            }

            setGame(gameWithImage)
        }

        fetchGame();
    },[id])

    useEffect(() => {
        const fetchBanner = async ()=> {
            if (!id) return;
                        
            const { data: bannerData, error: errorBannerData } = await supabaseClient
            .from('banner_with_filename')
            .select('id, object_filename')
            .eq('id_game', id)
            
            if(errorBannerData){
                console.error("Error fetching banner:", errorBannerData.message);
                return;
            }
            
            const banners = bannerData.map((banner: any) => ({
                ...banner, 
                image: `${baseUrl}/storage/v1/object/public/banner/${banner.object_filename}`
            }))
            
            setBanner(banners)
        }

        fetchBanner()
    }, [id])

    useEffect(()=> {
        const fetchGenre = async () => {
            if (!id) return;

            const { data, error } = await supabaseClient
            .from('genre')
            .select('id, genre')
            .eq('id_game', id)

            if (error) {
                console.error('Error fetching genre:', error)
            } else {
                setGenre(data)
            }
        }

        fetchGenre()
    }, [id])

    const handleBuy = () => {
        router.push(`/checkout?id=${id}`);
    }

    const handleCart = async () => {
        const { data: userData, error: userError } = await supabaseClient.auth.getUser()
        if (userError) {
            console.error("Error fetching user:", userError);
            return;
        }
        const userId = userData?.user?.id;
        
        const { data, error } = await supabaseClient
            .from('cart')
            .insert({
                game_id: id,
                user_id: userId,
            });
            
        if (error) {
            return
        }
    }
    return (
        <div className="min-h-[100vh]" style={{backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
                {banner.length > 0 ?
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        autoplay={{ delay: 5000,
                        disableOnInteraction: false,
                        }}
                        slidesPerView={1}
                        navigation
                        loop={true}
                        className='w-full'
                        >
                            {banner.map((banner)=>{
                                return(
                                    <SwiperSlide key={banner?.id}>
                                        <div className="relative h-[600px] text-white overflow-hidden bg-no-repeat bg-cover flex flex-col justify-end mt-[60px]" style={{ backgroundImage: `url(${banner.image})` }}>
                                            <div className="absolute inset-0 bg-black opacity-20 z-0" />
                                            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#000000] to-transparent z-10" />
                                            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#1D1D1D] to-transparent z-10" />
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                    </Swiper>
                    :
                    <div className="h-[600px]">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" style={{color: 'var(--green)'}}>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                    </div>
                }
            </header>
            <main className="p-10 mt-10">
                <div className="flex">
                    <div className="flex-col min-w-[225px]">
                        {
                            game && 
                            <div className="relative w-full h-auto aspect-square">
                                <Image
                                    src={game?.image}
                                    fill
                                    alt={game?.name}
                                    className="object-cover"
                                    />
                            </div>
                        }
                        <div className="flex p-2 gap-3 mt-5">
                            <button className="flex-1 px-3 py-1 text-nowrap rounded-sm font-semibold" style={{backgroundColor: 'var(--green)'}}>+ Wishlist</button>
                            <button onClick={handleCart} className="flex-1 px-3 py-1 text-nowrap rounded-sm font-semibold cursor-pointer" style={{backgroundColor: 'var(--green)'}}>+ Cart</button>
                        </div>
                    </div>
                    <div className="flex-1 px-5 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl text-white">{game?.name}</h1>
                            <p className="text-justify" style={{color: 'var(--light-gray)'}}>{game?.description}</p>
                            {genre.length > 0 && 
                            <div className="flex gap-3 mt-2">
                                {genre.map((item) => <p className="text-white px-3 py-1 rounded-sm bg-[#626262]" key={item.id}>{item.genre}</p>)}
                            </div>
                            }
                        </div>
                        <div className="w-full flex justify-between items-center">
                            <p style={{color: 'var(--light-gray)'}}>{game?.developer}</p>
                            <div className="p-3 flex gap-3 items-center" style={{backgroundColor: 'var(--dark-gray)'}}>
                                <p className="text-xl" style={{color: 'var(--green)'}}>{'Rp '+game?.price}</p>
                                <button className="px-4 py-2 rounded-sm text-black font-semibold" style={{backgroundColor: 'var(--green)'}}>BUY NOW</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}