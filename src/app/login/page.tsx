'use client'

import Image from "next/image"
import supabaseClient from "@/lib/supabaseClient"
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function LoginPage() {
    const [ showPass, setShowPass ] = useState(false)
    const router = useRouter()

    // Submit Btn OnClick
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        console.log(email)
        console.log(password)

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('Login gagal: ' + error.message);
            console.error('Login gagal:', error.message);
        } else {
            router.push(`/`)
        }
    }

    // Sign up btn Onclick
    const handleSignUp = () => {
        router.push('/register');
    }

    // Forget Btn OnClick
    const handleForgetPassword = () => {
        router.push('/forget-password');
    }

    const togglePass = () => {
        setShowPass(prev => !prev)
    }


    return(
        <div className="h-[100vh] flex items-center justify-end">
            <div className="grow h-[100%] flex items-center justify-center">
                <Image 
                src={'/games_bg.jpg'}
                width={1820}
                height={1024}
                alt={'Games'}
                className="w-full h-full object-cover"
                />
            </div>
            <div className="max-w-[790px] h-full w-[50%] text-black flex flex-col justify-center border-l-1" style={{ backgroundColor: 'var(--gray)'}}>
                <form className="flex flex-col text-white p-20" onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <h1 className="w-[100%] text-start text-3xl text-white">Log in to <span className="font-bold" style={{color: 'var(--green)'}}>IGUS STORE</span></h1>
                        <p className="" style={{color: 'var(--light-gray)' }}>Dive in & explore +100.000 games!</p>
                    </div>
                    <input name="email" placeholder="Enter your email or username" className="bg-white p-3 text-black border-none outline-none rounded-[5px] mb-5"/>
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
                    <div className="flex">Forget your<button onClick={handleForgetPassword} type="button" className="ml-2 cursor-pointer text-white" style={{ color: 'var(--green)' }}>password?</button></div>
                    
                    <div className="flex flex-col gap-3 mt-5 items-center">
                        <button className="px-6 py-2 rounded-[5px] w-full cursor-pointer text-black " style={{ backgroundColor: 'var(--green)' }} type="submit">Log in</button>
                        <div className="flex">Need an account?<button onClick={handleSignUp} type="button" className="ml-2 cursor-pointer" style={{ color: 'var(--green)' }}>Register here</button></div>
                    </div>
                </form>
                <p className="text-white text-xs mx-auto mt-auto mb-5">Terms of Service | Privacy Policy</p>
            </div>
        </div>
    )
}