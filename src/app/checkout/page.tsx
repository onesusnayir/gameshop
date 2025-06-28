'use client';
export const dynamic = 'force-dynamic'

import supabaseClient from "@/lib/supabaseClient"
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Sidebar from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    snap: any
  }
}

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
    const [token, setToken] = useState<string | null>(null);
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

    // Buy Onlciclk
    const handlePay = async () => {
            
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) {
            console.error("User not authenticated");
            return;
        }
        const res = await fetch('/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                gross_amount: (game && game.price * 11 / 100 + 2500 + game.price),
                game_id: game?.id,
                user_id: user.id
            }),
        })
        const data = await res.json()
        setToken(data.token);

        const { data: transactionData, error: transactionError } = await supabaseClient
            .from('transaction')
            .insert({
                id: data.orderId,
                user_id: user.id,
                game_id: game?.id,
                total_price: (game && game.price * 11 / 100 + 2500 + game.price)
            })
        if (transactionError) {
            console.error("Error inserting transaction:", transactionError);
            return
        }


        // Jalankan Midtrans Snap
        window.snap.pay(data.token, {
            onSuccess: function(result: any) {
                console.log('Pembayaran sukses:', result)
                // Tampilkan modal / update UI
            },
            onPending: function(result : any) {
                console.log('Pembayaran pending:', result)
                // Bisa tampilkan pesan: "Silakan selesaikan pembayaran"
            },
            onError: function(result: any) {
                console.log('Pembayaran gagal:', result)
                // Tampilkan error ke user
            },
            onClose: function() {
                console.log('User menutup popup tanpa menyelesaikan pembayaran')
            }
        })
    }

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
                <button onClick={handlePay} className="w-full p-1 bg-amber-400 rounded-2xl text-white font-bold mt-3 cursor-pointer">Pay</button>
            </div>
        </div>
    )
}
