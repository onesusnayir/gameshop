import Image from "next/image"

export default function() {
    return(
        <footer className="flex justify-center p-10">
            <Image 
            src={'/copyright.png'}
            width={'328'}
            height={'33'}
            alt="copyright"
            className="w-[200px] h-auto"/>
        </footer>
    )
}