'use client'

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import supabaseClient from "@/lib/supabaseClient"
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login gagal:', error.message);
        } else {
            console.log('Login berhasil:', data);
            router.push(`/`)
        }
    }

    return(
        <div className="h-[100vh] flex items-center justify-end">
            <div className="grow h-[100%] flex items-center justify-center">
                <Image 
                src={'/logo.png'}
                width={200}
                height={200}
                alt={'logo'}
                className="rounded-full"
                />
            </div>
            <div className="h-full w-[50%] text-black bg-black flex flex-col justify-center gap-10 p-20 border-l-1 border-orange-400">
                <h1 className="w-[100%] text-start text-3xl font-extrabold text-orange-400">Sign in</h1>
                <form className="flex flex-col gap-3 text-white" onSubmit={handleSubmit}>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" placeholder="Email" name={'email'}/>

                    <Label htmlFor="password">Password</Label>
                    <Input type="password" placeholder="Password" name={'password'}/>
                    
                    <div className="flex flex-col gap-3 mt-5">
                        <button className="px-6 py-2 bg-amber-400 rounded-3xl" type="submit">Sign in</button>
                        <button type="button">Dont have an account? Sign up</button>
                    </div>
                </form>
            </div>
        </div>
    )
}