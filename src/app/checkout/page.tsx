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
    game: Game[];
    tax: number;
    date: string;
    paymentFee: number;
    totalPrice: number;
}

    // body.transactionId,
    // body.totalPrice,
    // body.game[]\
    //  const { transactionId, totalPrice, games} = await req.json()
export default function Checkout() {
    const [games, setGames] = useState<Game[]>([])
    const [transaction, setTransaction] = useState<Transaction>()
    const [gamesId, setGamesId] = useState<string[]>([])

    useEffect(() => {
        const fetchGames = async() => {
            const rawIds = sessionStorage.getItem('selectedGameIds');
            const ids = rawIds ? JSON.parse(rawIds) : [];

            if (ids.length === 0) return console.error('games missing');
    
            setGamesId(ids)
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

            setGames(data)
            setTransaction(newTransaction)
        }

        fetchGames()
    }, []);

    const handlePay = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const access_token = session?.access_token;

        if(!transaction) return
        const request = {
            transactionId: transaction.id,
            totalPrice: transaction.totalPrice,
            games: gamesId

        }

        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify(request),
        });

        const {token_midtrans, transaction_id} = await res.json()

        window.snap.pay(token_midtrans, {
            onSuccess: async function(result: any) {
                console.log('Pembayaran sukses:', result)
                const { data: updateData, error: errorUpdate } = await supabaseClient
                .from('transaction')
                .update({ status: 'Paid' })
                .eq('id', transaction_id);
            },
            onPending: async function(result : any) {
                console.log('Pembayaran pending:', result)
                console.log('transaction id:',transaction_id)
                const { data: updateData, error: errorUpdate } = await supabaseClient
                .from('transaction')
                .update({ status: 'Failed' })
                .eq('id', transaction_id);
            },
            onError: function(result: any) {
                console.log('Pembayaran gagal:', result)
                // Tampilkan error ke user
            },
            onClose: async function() {
                console.log('User menutup popup tanpa menyelesaikan pembayaran')
            }
        })
    }

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--gray)'}}>
            <header className="mt-[60px]">
                <Navbar/>
            </header>
            <main className="p-10">
               <h1 className="text-2xl text-white font-semibold">Payment Details</h1>
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
                <button onClick={handlePay} className="w-full p-2 font-semibold my-4 rounded cursor-pointer" style={{backgroundColor: 'var(--green)'}}>PROCEED TO PAY</button>
               </section>
            </main>
        </div>
    )
}
