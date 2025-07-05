'use client'
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { useEffect, useState } from "react"
import supabaseClient from "@/lib/supabaseClient"
import Image from "next/image"
import { useRouter } from "next/navigation"

type GameHistory = {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  genre: string[];
  image: string;
}


type User = {
    id: string;
    username: string;
    email: string;
}

export default function Profile(){
    const [ games, setGames ] = useState<GameHistory[]>([]);
    const [user, setUser] = useState<User>()
    const router = useRouter()
    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
                error
            } = await supabaseClient.auth.getUser();

            if (error) {
                console.error("Error fetching user:", error.message);
                return;
            }

            if (user) {
                const { data: dataUsername, error: usernameError}  = await supabaseClient
                .from('user')
                .select('username')
                .eq('auth_id', user.id)
                .single()

                if(usernameError){
                    return console.error(usernameError.message)
                }

                const loginUser = {
                    id: user.id,
                    username: dataUsername.username,
                    email: user.email ?? '',
                }
                setUser(loginUser)
            }
        }

        getUser()
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchGame = async () => {
            const { data: historyData, error: historyError } = await supabaseClient
            .from('game_transaction_view')
            .select('*')
            .eq('user_id', user.id)

            if (historyError) {
                console.error("Error fetching games:", historyError.message);
                return;
            }

            const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

            const gameWithImage = historyData.map((data: any) => {
                const date = new Date(data.transaction_date);

                const formatted = date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
                });
                return {
                    ...data,
                    id: data.transaction_id,
                    name: data.game_name,
                    genre: data.genres,
                    created_at: formatted,
                    image: `${baseUrl}/storage/v1/object/public/games/${data.image_url}`
                };
            });

            setGames(gameWithImage)
        }

        fetchGame();
    },[user])

    const handleLogout = async ()=>{
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error("Logout failed:", error.message);
        } else {
            router.push('/')
        }
    }

    const gamesList = games.map((game) => {
        return(
            <div key={game.id} className="w-full flex" style={{backgroundColor: '#363434'}}>
                <div className="relative w-[150px] h-[150px]">
                    <Image 
                    src={game.image} 
                    alt={game.name} 
                    fill
                    className="object-cover"
                    />
                </div>
                <div className="flex-1 flex px-5 py-4 justify-between">
                    <div className="grow max-w-[450px] flex flex-col justify-start gap-2">
                        <h1 className="text-white text-3xl ">{game.name}</h1>
                        {game.genre && 
                            <div className="flex gap-3">
                                { game.genre.map((item, index) => <p className="text-white text-sm px-3 py-1 rounded-sm bg-[#626262]" key={index}>{item}</p>)}
                            </div>
                            }
                        <p className="line-clamp-2 text-sm" style={{color: 'var(--light-gray)'}}>{game.description}</p>
                    </div>
                    <div className="flex flex-col items-end justify-end">
                        <p className="text-white flex-1 text-sm">{game.created_at}</p>
                        <div>
                            <p className="text-white text-start w-full">Total Price</p>
                            <p className="text-2xl" style={{color: 'var(--green)'}}>{'Rp '+game.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="min-h-screen" style={{backgroundColor: 'var(--gray)'}}>
            <header>
                <Navbar />
            </header>
            <main className="mt-[60px]">
                <h1 className="p-10 text-2xl font-semibold text-white">Your Profile</h1>
                <section className="mx-10 p-5" style={{backgroundColor: 'var(--dark-gray)'}}>
                    <div className="flex justify-between">
                        <p className="text-white">Username :</p>
                        <p style={{color: 'var(--green)'}}>{user ? user.username:''}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-white">Email :</p>
                        <p style={{color: 'var(--green)'}}>{user ? user.email : ''}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-[#913F3F] text-end cursor-pointer">Logout</button>
                </section>
                <section className="mx-10 mt-5 p-5" style={{backgroundColor: 'var(--dark-gray)'}}>
                    <p className="py-5 text-xl" style={{color: 'var(--green)'}}>Purchase History</p>
                    <div className="flex flex-col gap-3">
                        {
                            games.length > 0 && gamesList
                        }
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}