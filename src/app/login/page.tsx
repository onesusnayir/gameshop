'use client'

import Image from "next/image"
import supabaseClient from "@/lib/supabaseClient"
import { useRouter } from 'next/navigation';

export default function LoginPage() {
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

    return(
        <div className="h-[100vh] flex items-center justify-end">
            <div className="grow h-[100%] flex items-center justify-center">
                <Image 
                src={'/games_bg.png'}
                width={200}
                height={200}
                alt={'Games'}
                className="w-full h-full object-fit"
                />
            </div>
            <div className="h-full w-[50%] text-black bg-black flex flex-col justify-center p-20 border-l-1">
                <div className="mb-10">
                    <h1 className="w-[100%] text-start text-3xl text-white">Log in to <span className="font-bold italic" style={{color: 'var(--light-blue)'}}>IGUS STORE</span></h1>
                    <p className="" style={{color: 'var(--light-gray)' }}>Dive in & explore +100.000 games!</p>
                </div>
                <form className="flex flex-col text-white" onSubmit={handleSubmit}>
                    <input name="email" placeholder="Enter your email or username" className="bg-white p-3 text-black border-none outline-none rounded-[2px] mb-5"/>
                    <input name="password" placeholder="Enter your password" className="bg-white p-3 text-black border-none outline-none rounded-[2px] mb-5"/>
                    <div className="flex">Forget your<button onClick={handleForgetPassword} type="button" className="ml-2 cursor-pointer text-white" style={{ color: 'var(--light-blue)' }}>password?</button></div>
                    
                    <div className="flex flex-col gap-3 mt-5 items-center">
                        <button className="px-6 py-2 rounded-[2px] w-full cursor-pointer" style={{ backgroundColor: 'var(--light-blue)' }} type="submit">Log in</button>
                        <div className="flex">Need an account?<button onClick={handleSignUp} type="button" className="ml-2 cursor-pointer" style={{ color: 'var(--light-blue)' }}>Register here</button></div>
                    </div>
                </form>
            </div>
        </div>
    )
}