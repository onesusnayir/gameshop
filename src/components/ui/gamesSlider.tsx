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

export default function gamesSlider({ games } : SliderProps){
    const router = useRouter()
    const handleMoveGame = (gameid : string) => {
      router.push(`/game?id=${gameid}`)
    }
  
    return (
       <div className="w-full">
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={5}
            spaceBetween={10}
            className=''
            >
        {games.length > 0 && games.map((game) => (
          <SwiperSlide key={game.id}>
            <div key={game.id} onClick={() => handleMoveGame(game.id)} className="relative h-[400px] w-full bg-no-repeat bg-cover flex flex-col justify-end cursor-pointer" style={{ backgroundImage: `url(${game.image})` }}>
                <div className="absolute bottom-12 left-0 w-full h-10 bg-gradient-to-t from-[#1D1D1D] to-transparent z-10" />
                <div className='relative h-[50px] p-4 z-20' style={{ backgroundColor: 'var(--gray)'}}>
                    <h1 className='font-semibold text-[14px] text-white text-nowrap'>{game.name}</h1>
                    <p className='text-[12px] text-white'>{'Rp '+game.price}</p>
                </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    )
}