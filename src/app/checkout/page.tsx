'use client';

import supabaseClient from "@/lib/supabaseClient"
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Sidebar from "@/components/ui/sidebar";


type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  image: string;
}

export default function Checkout() {
    const [game, setGame] = useState<Game | null>(null);
    const searchParams = useSearchParams()
    const id = searchParams.get('id');

    useEffect(() => {
        const fetchGame = async () => {
            const { data, error } = await supabaseClient
                .from('game')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching game:", error);
                return;
            }
            setGame(data);
        }

        fetchGame();
    }, []);
    return (
        <div>
            <Sidebar />
            <div className="ml-[200px] p-10">
                <h1 className="font-bold text-xl mb-5">Payment Details</h1>
                <div className="py-0.5 px-1 flex justify-between">
                    <p>{game?.name}</p>
                    <p>{'Rp. '+game?.price}</p>
                </div>
                <div className="py-0.5 px-1 flex justify-between">
                    <p>Tax</p>
                    <p>{'Rp. '+ (game ? game.price * 11 / 100 : '-')}</p>
                </div>
                <div className="py-0.5 px-1 flex justify-between border-b-2 border-b-gray-200">
                    <p>Payment Fee</p>
                    <p>{'RP. 2500'}</p>
                </div>
                <div className="py-0.5 flex justify-end font-bold">
                    <p>{'Rp. '+(game ? game.price * 11 / 100 + 2500 + game.price : '-')}</p>
                </div>
                <button className="w-full p-1 bg-amber-400 rounded-2xl text-white font-bold mt-3">Pay</button>
            </div>
        </div>
    )
}
