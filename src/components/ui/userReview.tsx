interface UserReviewProps {
    recomend: boolean;
    review: string;
    date: string;
}

export default function UserReview({recomend, date, review} : UserReviewProps){
    return(
    <div className="p-5 flex flex-col gap-2" style={{backgroundColor: 'var(--dark-gray)'}}>
        <div className="flex justify-between">
            <h1 className="font-semibold" style={{color: 'var(--green)'}}>Your review</h1>
            <p style={{color: recomend? 'var(--green)': 'var(--red)'}}>{recomend? 'Recommended': 'Not Recommended'}</p>
        </div>
        <p className="text-white text-justify p-3" style={{backgroundColor: '#323232'}}>{review}</p>
        <div className="flex justify-end gap-2">
            <button className="cursor-pointer" style={{color: 'var(--green)'}}>Edit</button>
            <button className="cursor-pointer" style={{color: 'var(--red)'}}>Delete</button>
            <p className="text-white">{new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
                })}
            </p>
        </div>
    </div>
    )
}