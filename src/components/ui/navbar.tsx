import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar () {
    const router = useRouter()
    const handleLogin = () => {
        router.push('/login')
    }
    const handleHome = () => {
        router.push('/')
    }
    const handleGames = () => {
        router.push('/games')
    }
    // const handleWishlist = () => {
    //     router.push('/login')
    // }
    const handleCart = () => {
        router.push('/cart')
    }
    return(
        <nav className="fixed top-0 z-50 w-full p-5 flex gap-5 text-white items-center justify-around" style={{ backgroundColor: 'var(--gray)' }}>
            <Image 
            src={'/icon.svg'}
            width={50}
            height={50}
            alt='icon'
            className="w-[30px] h-[30px]"/>
            <ul className="grow max-w-[500px] flex justify-around">
                <li onClick={handleHome} ><button className="cursor-pointer">Home</button></li>
                <li onClick={handleGames}><button className="cursor-pointer">Game</button></li>
                <li  className=""><button>Wishlist</button></li>
                <li onClick={handleCart}><button className="cursor-pointer">Cart</button></li>
            </ul>
            <div className="flex min-w-[300px] rounded-sm items-center" style={{ backgroundColor: 'var(--dark-gray)' }}>
                <button className="text-xl flex items-center cursor-pointer">
                    <span className="material-symbols-outlined text-white text-xl ml-4">search</span>
                </button>
                <input className="grow px-4 py-2 border-none outline-none rounded-sm" type="text" placeholder="Search"/>
            </div>
            <button onClick={handleLogin} className="px-6 py-2 rounded-sm text-black cursor-pointer" style={{ backgroundColor: 'var(--green)'}}>Log in</button>
        </nav>
    )
}