import Image from "next/image";
import Footer from "@/components/ui/footer";
import supabaseClient from "@/lib/supabaseClient";

export default function forgetPassPage(){
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
                        <input type="submit" className="py-1 rounded" style={{backgroundColor: 'var(--green)'}}/>
                        <p className="w-full text-center text-white">Back to Login <button style={{color: 'var(--green)'}}>here</button></p>
                    </form>
                </div>
                <Footer />
            </section>
        </div>
    )
}