'use client';

import Navbar from "@/components/ui/navbar";
import supabaseClient from "@/lib/supabaseClient"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid'

const tax = 0.12;

declare global {
  interface Window {
    snap: any
  }
}

type Game = {
  id: string;
  name: string;
  price: number;
}

type Transaction = {
    id: string;
    date: string;
    game: Game[];
    tax: number;
    paymentFee: number;
    totalPrice: number;
}
export default function Checkout() {
    const [games, setGames] = useState<Game[]>([])
    const [transaction, setTransaction] = useState<Transaction>()

    useEffect(() => {
        const fetchGames = async() => {
            const rawIds = sessionStorage.getItem('selectedGameIds');
            const ids = rawIds ? JSON.parse(rawIds) : [];

            if (ids.length === 0) return console.error('games missing');
    
            const { data, error } = await supabaseClient
            .from('game')
            .select('id, name, price')
            .in('id', ids);

            if(error){
                console.error(error.message)
            }

            if(!data){
                return console.error('games missing');
            }

            const rawUuid = uuidv4().split('-')[0]
            const idTransaction = `ORDER-${Date.now()}-${rawUuid}`
            const dateNow =  new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })
            const totalGamesPrice = data.reduce((sum, game) => sum + game.price, 0);
            const totalPrice = totalGamesPrice + (totalGamesPrice * tax) + 2500;
            const transactionTax = parseFloat((totalPrice * tax).toFixed(3));
            const newTransaction = {
                id : idTransaction,
                date: dateNow,
                game: data,
                tax: transactionTax,
                paymentFee: 2500,
                totalPrice: totalPrice,
            }

            console.log(data)
            setGames(data)
            setTransaction(newTransaction)
        }

        fetchGames()
    }, []);


    // const [game, setGame] = useState<Game | null>(null);
    // const [id, setId] = useState<string | null>(null);
    // const [token, setToken] = useState<string | null>(null);
    // const router = useRouter();

    // useEffect(() => {
    // if (typeof window !== "undefined") {
    //     const searchParams = new URLSearchParams(window.location.search);
    //     const gameId = searchParams.get('id');
    //     setId(gameId);
    // }
    // }, []);


    // useEffect(() => {
    //     const checkSession = async () => {
    //     const { data: { session } } = await supabaseClient.auth.getSession()
    //     console.log(session)
    //         if (!session) {
    //             router.push('/login')
    //         }
    //     }

    //     checkSession()
    // }, [])

    // useEffect(() => {
    //     if (!id) return;

    //     const fetchGame = async () => {
    //         const { data, error } = await supabaseClient
    //             .from('game')
    //             .select('*')
    //             .eq('id', id)
    //             .single();

    //         if (error) {
    //             console.error("Error fetching game:", error);
    //             return;
    //         }
    //         setGame(data);
    //     }

    //     fetchGame();
    // }, [id]);

    // // Buy Onlciclk
    // const handlePay = async () => {
            
    //     const { data: { user } } = await supabaseClient.auth.getUser()
    //     if (!user) {
    //         console.error("User not authenticated");
    //         return;
    //     }
    //     const res = await fetch('/api/token', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         credentials: 'include',
    //         body: JSON.stringify({ 
    //             gross_amount: (game && game.price * 11 / 100 + 2500 + game.price),
    //             game_id: game?.id,
    //             user_id: user.id
    //         }),
    //     })
    //     const data = await res.json()
    //     setToken(data.token);

    //     const { data: transactionData, error: transactionError } = await supabaseClient
    //         .from('transaction')
    //         .insert({
    //             id: data.orderId,
    //             user_id: user.id,
    //             game_id: game?.id,
    //             total_price: (game && game.price * 11 / 100 + 2500 + game.price)
    //         })
    //     if (transactionError) {
    //         console.error("Error inserting transaction:", transactionError);
    //         return
    //     }


    //     // Jalankan Midtrans Snap
    //     window.snap.pay(data.token, {
    //         onSuccess: function(result: any) {
    //             console.log('Pembayaran sukses:', result)
    //             // Tampilkan modal / update UI
    //         },
    //         onPending: function(result : any) {
    //             console.log('Pembayaran pending:', result)
    //             // Bisa tampilkan pesan: "Silakan selesaikan pembayaran"
    //         },
    //         onError: function(result: any) {
    //             console.log('Pembayaran gagal:', result)
    //             // Tampilkan error ke user
    //         },
    //         onClose: function() {
    //             console.log('User menutup popup tanpa menyelesaikan pembayaran')
    //         }
    //     })
    // }
    

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--gray)'}}>
            <header className="mt-[60px]">
                <Navbar/>
            </header>
            <main className="p-10">
               <h1 className="text-2xl text-white font-semibold">Order Details</h1>
               <section className="p-5 mt-5" style={{backgroundColor: 'var(--dark-gray)'}}>
                <div className="flex justify-between">
                    <p style={{color: 'var(--light-gray)'}}>Transaction Id</p>
                    <p className="text-white">{transaction && '#'+transaction.id}</p>
                </div>
                <div className="flex justify-between">
                    <p style={{color: 'var(--light-gray)'}}>Date</p>
                    <p className="text-white">
                        {transaction && transaction.date}
                    </p>
                </div>
               </section>
               <section className="p-5 mt-5 flex flex-col gap-4" style={{backgroundColor: 'var(--dark-gray)'}}>
                <div className="flex justify-between text-end">
                    <p style={{color: 'var(--light-gray)'}}>Items</p>
                    <div>
                    {
                       games && games.map((item, index) => {
                            return(
                                <p key={index} className="text-white">{item.name}</p>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="flex justify-between">
                    <p style={{color: 'var(--light-gray)'}}>Price</p>
                    <div>
                    {
                       games && games.map((item, index) => {
                            return(
                                <p key={index} className="text-white">
                                    {item.price.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            )
                        })
                    }
                    </div>
                </div>
                <div className="flex justify-between">
                    <p style={{color: 'var(--light-gray)'}}>Tax</p>
                    <p className="text-white">
                        {transaction && transaction.tax.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p style={{color: 'var(--light-gray)'}}>Payment Fee</p>
                    <p className="text-white">
                        {transaction && transaction?.paymentFee.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p style={{color: 'var(--light-gray)'}}>Total Price</p>
                    <p className="text-white">
                        {transaction && transaction.totalPrice.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <button className="w-full p-2 font-semibold my-4 rounded" style={{backgroundColor: 'var(--green)'}}>PROCEED TO PAY</button>
               </section>
            </main>
        </div>
    )
}
