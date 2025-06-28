'use client'

import Sidebar from "@/components/ui/sidebar"
import { useState, useEffect } from "react";
import supabaseClient from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession()
        console.log(session)
            if (!session) {
                router.push('/login')
            }
        }

        checkSession()
    }, [])

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

            if (gameError) {
                console.error("Error fetching games:", gameError);
                return;
            }
            setCartItems(gameData);
            { cartItems.length > 0 ? <div>{cartElements}</div>: <p>You cart is empty</p>}
        }

        fetchData();
    },[])

    const cartElements = cartItems.map((item) => (
        <div key={item.id} className="flex border-b-2 border-gray-200 py-5 gap-5 items-center">
            <span onClick={() => handleDeleteItem(item.id)} className="material-symbols-outlined text-orange-300 cursor-pointer">delete</span>
            <div onClick={ () => handleItemsClick(item.id) } className="cursor-pointer flex gap-5">
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
        </div>
    ));

    const handleItemsClick = (game_id : string) => {
        router.push(`/game?id=${game_id}`);
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
            .from('cart')
            .delete()
            .eq('user_id', userId)
            .eq('game_id', game_id);

        if (error) {
            console.error("Error deleting item:", error);
            return;
        }

        // Refresh Cart
        setCartItems(cartItems.filter(item => item.id !== game_id));
    }

    return (
        <div>
            <Sidebar />
            <div className="ml-[200px] p-5">
                <h1 className="text-orange-400 font-bold text-2xl">Your Cart</h1>
                { cartItems.length > 0 ? <div>{cartElements}</div>: <p>You cart is empty</p>}
            </div>
        </div>
    )
}