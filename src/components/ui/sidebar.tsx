import { useRouter } from "next/navigation"

export default function Sidebar() {
    const router = useRouter();

    const handleHome = () => {
        router.push('/'); 
    }
    const handleGames = () => {
        router.push('/games');
    }
    const handleCart = () => {
        router.push('/cart');
    }
    return (
        <aside className="fixed min-h-[100vh] w-[200px] flex flex-col px-5 pt-5 border-r-1 border-orange-400 bg-white justify-between">
            <div>
                <h1 className="text-center font-bold text-xl">Game<span className="text-orange-400">Shop</span></h1>
                <ul className="flex flex-col gap-3 mt-10">
                    <li className="flex items-center gap-2" onClick={handleHome}><span className="material-symbols-outlined">home</span>Home</li>
                    <li className="flex items-center gap-2" onClick={handleGames}><span className="material-symbols-outlined">sports_esports</span>Games</li>
                    <li className="flex items-center gap-2" onClick={handleCart}><span className="material-symbols-outlined">shopping_cart</span>Cart</li>
                </ul>
            </div>
            <div className="mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined">account_circle</span>
                <div className="flex flex-col gap-1">
                    <p></p>
                    <p></p>
                </div>
            </div>
      </aside>
    )
}