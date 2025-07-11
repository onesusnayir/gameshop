'use client'
import Image from "next/image"
import supabaseClient from "@/lib/supabaseClient"
import AuthFooter from "@/components/ui/authFooter";
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function RegisterPage() {
    const [ showPass, setShowPass ] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') as string || '').trim();
        const username = (formData.get('username') as string || '').trim();
        const password = (formData.get('password') as string || '').trim();

        if(!email && !username && !password){
            return;
        }

        const { data: existingUser, error: userCheckError } = await supabaseClient
            .from('user')
            .select('id')
            .eq('username', username)
            .maybeSingle(); 
        if (existingUser) {
            alert("Username sudah digunakan.");
            return;
        }

        const redirectUrl = `https://gameshop-eosin.vercel.app/register-success?username=${encodeURIComponent(username)}`

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl
            }
        });

        if (error) {
            console.error('Submit gagal:', error.message);
        }
        if(data){
            alert('We sent an email to you')
        }
    }

    const handleSignIn = () => {
        router.push('/login');
    }

    const togglePass = () => {
        setShowPass(prev => !prev)
    }

    
    return(
        <div className="h-[100vh] flex items-center">
            <div className="h-full min-w-[550px] max-w-[550px] text-black flex flex-col border-l-1" style={{backgroundColor: 'var(--gray)'}}>
                <form className="flex-grow flex flex-col justify-center text-white px-20" onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <h1 className="w-[100%] text-start text-3xl text-white">Create your <span style={{ color: 'var(--green)'}}>Account</span></h1>
                        <p style={{color: 'var(--light-gray'}}>57.000+ players waiting you!</p>
                    </div>
                    <input name="email" placeholder="Enter your email" className="bg-white p-3 text-black border-none outline-none rounded-[5px] mb-5"/>
                    <input name="username" placeholder="Enter your username" className="bg-white p-3 text-black border-none outline-none rounded-[5px] mb-5"/>
                    <div className="bg-white flex mb-5 rounded-[5px] whitespace-nowrap items-center">
                        <input name="password" placeholder="Enter your password" className="bg-white p-3 text-black border-none outline-none max-w-full flex-1 rounded-[5px]" type={showPass ? 'text' : 'password'}/>
                        <button
                            type="button"
                            onClick={togglePass}
                            className="text-black px-5 mt-1 text-xl">
                                <span className="material-symbols-outlined">
                                {showPass ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                    </div>
                    <div className="flex flex-col gap-3 mt-5 items-center">
                        <button className="px-6 py-2 rounded-[5px] w-full cursor-pointer text-black" style={{ backgroundColor: 'var(--green)'}} type="submit">Sign up</button>
                        <div className="flex items-center whitespace-nowrap">Alrady have an account?<button onClick={handleSignIn} type="button" className="cursor-pointer ml-2" style={{ color: 'var(--green)'}}>Sign in here</button></div>
                    </div>
                </form>
                <AuthFooter/>
            </div>

            <div className="grow h-[100%] flex items-center justify-center">
                <Image 
                src={'/games_bg.jpg'}
                width={1820}
                height={1024}
                alt={'logo'}
                className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}