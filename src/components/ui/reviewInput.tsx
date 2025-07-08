import { useState } from "react"

interface ReviewInputProps{
    handlePostReview: (review: string, recommend: boolean) => void;
}

export default function ReviewInput ({ handlePostReview }: ReviewInputProps) {
    const [recommend, setRecommend] = useState<boolean | null>(null)

    const postReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
           
        const formData = new FormData(e.currentTarget)
        const review = formData.get('review') as string

        if(!review.trim() ){
            alert('You have to click recomend button (Yes/No)')
            return
        }
        if(recommend === null){
            alert('You have to fill review')
            return
        }

        handlePostReview(review, recommend)
      return
    }
    return(
    <form onSubmit={postReview} className="p-5 flex flex-col gap-3" style={{backgroundColor: 'var(--dark-gray)'}}>
        <h1 className="font-semibold" style={{color: 'var(--green)'}}>Your review</h1>
        <textarea name="review" rows={4} className="w-full border-none outline-none rounded p-2 text-white" style={{backgroundColor: '#323232'}}></textarea>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-white">Do you recomend this game</p>
                <button type="button" onClick={() => setRecommend(true)} style={{backgroundColor: 'var(--green)'}} className="px-3 py-1 rounded mr-2 font-semibold">
                    Yes
                </button>
                <button type="button" onClick={() => setRecommend(false)} style={{backgroundColor: 'var(--green)'}} className="px-3 py-1 rounded font-semibold">
                    No
                </button>
            </div>
            <button className="rounded px-3 py-2" type="submit" style={{backgroundColor: 'var(--green)'}}>Post Review</button>
        </div>
    </form>
    )
}