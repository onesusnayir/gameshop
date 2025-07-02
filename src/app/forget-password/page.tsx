import Image from "next/image";

export default function forgetPassPage(){
    return (
        <div className="min-h-[100vh] w-full flex flex-col items-center justify-center gap-5 bg-black">
            <p className="text-white">This page is still under constrcution</p>
            <Image 
            src={'/underconstruction.jpg'}
            width={100}
            height={100}
            className="w-[30%] h-auto rounded-xl"
            alt="underconstruction img"/>
            
        </div>
    )
}