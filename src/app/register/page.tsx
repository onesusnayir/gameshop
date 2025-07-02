'use client'
import Image from "next/image"
import supabaseClient from "@/lib/supabaseClient"
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert('Submit gagal: ' + error.message);
            console.error('Submit gagal:', error.message);
        } else {
            console.log('Submit berhasil:', data);
            router.push(`/login`)
        }
    }

    const handleSignIn = () => {
        router.push('/login');
    }
    
    return(
        <div className="h-[100vh] flex items-center justify-end">
            <div className="grow h-[100%] flex items-center justify-center">
                <Image 
                src={'/games_bg.png'}
                width={200}
                height={200}
                alt={'logo'}
                className="w-full h-full object-fit"
                />
            </div>
            <div className="h-full w-[50%] text-black bg-black flex flex-col justify-center p-20 border-l-1">
                <div className="mb-10">
                    <h1 className="w-[100%] text-start text-3xl text-white">Create your <span style={{ color: 'var(--light-blue)'}}>Account</span></h1>
                    <p style={{color: 'var(--light-gray'}}>57.000+ players waiting you!</p>
                </div>
                <form className="flex flex-col gap-3 text-white" onSubmit={handleSubmit}>
                    <input name="email" placeholder="Enter your email" className="bg-white p-3 text-black border-none outline-none rounded-[2px] mb-5"/>
                    <input name="username" placeholder="Enter your username" className="bg-white p-3 text-black border-none outline-none rounded-[2px] mb-5"/>
                    <input name="password" placeholder="Enter your password" className="bg-white p-3 text-black border-none outline-none rounded-[2px] mb-5"/>
                    <div className="flex flex-col gap-3 mt-5 items-center">
                        <button className="px-6 py-2 rounded-[2px] w-full cursor-pointer" style={{ backgroundColor: 'var(--light-blue)'}} type="submit">Sign up</button>
                        <div>Alrady have an account?<button onClick={handleSignIn} type="button" className="cursor-pointer ml-2" style={{ color: 'var(--light-blue)'}}>Sign in here</button></div>
                    </div>
                </form>
            </div>
        </div>
    )
}