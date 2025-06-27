'use client'
import Sidebar from "@/components/ui/sidebar"
import { useState, useEffect, use } from "react";
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
    const [cartItems, setCartItems] = useState<Game[]>([]);

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
                .from('game')
                .select('*')
                .in('id', data.map((item: any) => item.game_id));

                console.log("Cart Items:", gameData);
                console.log("Cart Items:", data);
                console.log("Userid:", userId);

            if (gameError) {
                console.error("Error fetching games:", gameError);
                return;
            }
            setCartItems(gameData);
        }

        fetchData();
    },[])

    const cartElements = cartItems.map((item) => (
        <div key={item.id} className="flex border-b-2 border-gray-200 py-5 gap-5 items-center">
            <span className="material-symbols-outlined text-orange-300">delete</span>
            <Image 
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/games/${item.image}`} 
            alt={item.name}
            width={100}
            height={100}/>
            <div>
                <h1>{item.name}</h1>
                <p>{`Rp. ${item.price}`}</p>
            </div>
        </div>
    ));

    return (
        <div>
            <Sidebar />
            <div className="ml-[200px] p-5">
                <h1 className="text-orange-400 font-bold text-2xl">Your Cart</h1>
                <div>{cartElements}</div>
            </div>
        </div>
    )
}