import Image from "next/image"

export default function AuthFooter() {
    return(
        <footer className="flex flex-col items-center justify-center p-5">
            <div className="flex justify-center items-center gap-2">
                <div className="relative w-[20px] h-[20px] ">
                    <Image 
                    src={'/icon.svg'}
                    fill
                    alt="icon"/>
                </div>
                <p className=" font-semibold" style={{color: 'var(--green)'}}>RISEN STORE</p>
            </div>
            <p className="text-white text-xs">Terms Of Service | Privacy Policy</p>
        </footer>
    )
}