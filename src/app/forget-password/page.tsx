'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";
import supabaseClient from "@/lib/supabaseClient";
import AuthFooter from "@/components/ui/authFooter";

export default function forgetPassPage(){
    const router = useRouter()
    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        const redirectUrl = `${window.location.origin}/set-password`

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
        })

        alert(`We sent an email to you, please check your email`)
    }

    const handleLogin = () => {
        router.push('/login')
    }
    return (
        <div className="min-h-screen flex">
            <div className="relative flex-1">
                <Image
                src={'/games_bg.jpg'}
                fill
                alt="games background"
                className="object-cover"
                />
            </div>
            <section className="min-h-full min-w-[550px] max-w-[550px] flex flex-col items-center" style={{backgroundColor: 'var(--gray)'}}>
                <div className="flex-1 flex flex-col gap-3 w-full justify-center p-10">
                    <div>
                        <h1 className="text-2xl font-semibold text-start" style={{color: 'var(--green)'}}><span className="text-white">Forget </span>Password</h1>
                        <p className="text-sm" style={{color: 'var(--light-gray)'}}>Reset your password</p>
                    </div>
                    <form className="flex flex-col gap-3" onSubmit={handleReset}>
                        <label className="text-white flex flex-col">
                            Email
                            <input 
                                className="border-none outline-none bg-white p-3 text-black rounded" 
                                type="email" 
                                name='email'
                                placeholder="Enter your email"
                            />
                        </label>
                        <input type="submit" className="py-1 rounded cursor-pointer" style={{backgroundColor: 'var(--green)'}}/>
                        <p className="w-full text-center text-white">Back to Login <button onClick={handleLogin} className="cursor-pointer" style={{color: 'var(--green)'}}>here</button></p>
                    </form>
                </div>
                <AuthFooter />
            </section>
        </div>
    )
}