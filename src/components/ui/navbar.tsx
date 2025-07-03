import Image from "next/image";

export default function Navbar () {
    return(
        <nav className="p-5 flex gap-5 text-white items-center justify-around" style={{ backgroundColor: 'var(--gray)' }}>
            <Image 
            src={'/icon.svg'}
            width={50}
            height={50}
            alt='icon'
            className="w-[30px] h-[30px]"/>
            <ul className="grow max-w-[500px] flex justify-around">
                <li>Home</li>
                <li>Games</li>
                <li>Wishlist</li>
                <li>Cart</li>
            </ul>
            <div className="flex min-w-[300px] rounded-sm items-center" style={{ backgroundColor: 'var(--dark-gray)' }}>
                <button className="text-xl flex items-center">
                    <span className="material-symbols-outlined text-white text-xl ml-4">search</span>
                </button>
                <input className="grow px-4 py-2 border-none outline-none rounded-sm" type="text" placeholder="Search"/>
            </div>
            <button className="px-6 py-2 rounded-sm text-black" style={{ backgroundColor: 'var(--green)'}}>Log in</button>
        </nav>
    )
}