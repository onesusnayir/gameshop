import Image from "next/image"

export default function Footer () {
    return(
        <footer className="flex justify-center p-10">
            <div className="flex items-center gap-2">
                <div className="text-2xl flex items-center text-gray-500">
                    <span className="material-symbols-outlined">copyright</span>
                </div>
                <div className="text-white text-xs pr-2 border-r-2 border-r-gray-500">
                    <p className=" text-gray-500 tracking-[0.2em]">Copyright</p>
                    <p className="text-gray-500">All Rights Reserved</p>
                </div>
                <div className="relative w-[20px] h-[20px]">
                    <Image 
                    src={'/icon.svg'}
                    fill
                    alt="icon"/>
                </div>
                <p className=" font-semibold" style={{color: 'var(--green)'}}>RISEN STORE</p>
            </div>
        </footer>
    )
}