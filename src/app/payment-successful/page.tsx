'use client'
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function (){
    const [detailIsShown, setDetailShown] = useState(false) 
    
    const searchParams = useSearchParams()
    const transactionId = searchParams.get('transaction_id')
    return (
        <div className="min-h-screen flex flex-col" style={{backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar/>
            </header>
            <main className="mt-[60px] flex-1 flex items-center justify-center">
                {detailIsShown? 
                <section className="flex flex-col gap-2 items-center justify-center">
                    <h1 className="text-3xl font-semibold" style={{color: 'var(--green)'}}>Payment Successful</h1>
                    <p className="text-white">Thanks for your purchase!</p>
                    <button className="w-full py-1 rounded font-semibold cursor-pointer" style={{backgroundColor: 'var(--green)'}}>VIEW ORDER</button>
                </section>
                :
                <div>
                    
                </div>
                }
            </main>
            <Footer/>
        </div>
    )
}