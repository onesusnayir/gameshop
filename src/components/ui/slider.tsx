'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Game = {
  id: string;
  name: string;
  description: string;
  price: number;
  developer: string;
  image: string;
};

interface SliderProps {
  games: Game[];
}

export default function Slider({ games } : SliderProps){
    const router = useRouter()
    const handleMoveGame = (gameid : string) => {
      router.push(`/game?id=${gameid}`)
    }

    const handleClick = (id: string) => {
      router.push(`/game?id=${id}`);
    }
  
    return (
       <div className="w-full">
       {games.length > 0 && ( <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{ delay: 5000,
              disableOnInteraction: false,
             }}
            slidesPerView={1}
            navigation
            loop={true}
            className='w-full'
            >
        {games.length > 0 && games.map((game) => (
          <SwiperSlide key={game.id}>
            <div onClick={()=> handleClick(game.id)} className="relative h-[600px] text-white overflow-hidden bg-no-repeat bg-cover flex flex-col justify-end" style={{ backgroundImage: `url(${game.image})` }}>
                <div className="absolute inset-0 bg-black opacity-20 z-0" />
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#000000] to-transparent z-10" />
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#1D1D1D] to-transparent z-10" />
                <div className='relative flex flex-col gap-1 items-start max-w-[50%] p-10 z-20'>
                    <p className='px-5 py-2 w-fit text-xs' style={{ backgroundColor: 'var(--gray)'}}>Latest Relases Games</p>
                    <h1 className='text-6xl font-semibold'>{game.name}</h1>
                    <p className='line-clamp-2' style={{color: 'var(--light-gray)'}}>{game.description}</p>
                    <button onClick={() => handleMoveGame(game.id)} className='px-4 py-1 text-black rounded-sm cursor-pointer' style={{ backgroundColor: 'var(--green)'}}>Go to Store</button>
                </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>)}
    </div>
    )
}