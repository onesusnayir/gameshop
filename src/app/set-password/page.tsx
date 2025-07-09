'use client'

import Image from "next/image";
import AuthFooter from "@/components/ui/authFooter";
import supabaseClient from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function forgetPassPage(){
    const router = useRouter()
    const hanldlePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const newPassword = formData.get('password') as string

        const { data: { user }, error, } = await supabaseClient.auth.getUser();

        const email = user?.email

        const { data, error: errorUpdate } = await supabaseClient.auth.updateUser({
            email: email,
            password: newPassword,
        })
        if(errorUpdate){
            alert('Error update password: '+ errorUpdate.message)
            return
        }
        alert('Password successfully updated')
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
                    <form className="flex flex-col gap-3" onSubmit={hanldlePassword}>
                        <label className="text-white flex flex-col">
                            Password
                            <input className="border-none outline-none bg-white p-3 text-black rounded" type="text" name="password" placeholder="Enter your new password"/>
                        </label>
                        <input type="submit" className="py-1 rounded cursor-pointer" style={{backgroundColor: 'var(--green)'}}/>
                        <p className="w-full text-center text-white">Back to Login <button type="button" onClick={handleLogin} className="cursor-pointer" style={{color: 'var(--green)'}}>here</button></p>
                    </form>
                </div>
                <AuthFooter />
            </section>
        </div>
    )
}