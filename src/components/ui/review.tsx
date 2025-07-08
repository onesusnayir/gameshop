interface ReviewProps {
    username: string;
    recomend: boolean;
    review: string;
    date: string;
}


export default function Review({ username, recomend, review, date}: ReviewProps) {
    return(
        <section className="p-5" style={{backgroundColor: 'var(--dark-gray)'}}>
            <div className="flex justify-between">
                <h2 className="font-semibold" style={{color: 'var(--green)'}}>{username}</h2>
                <p style={{color: recomend? 'var(--green)': 'var(--red)'}}>{recomend? 'Recommended': 'Not Recommended'}</p>
            </div>
            <div className="flex">
                <p className="flex-1 text-white">{review}</p>
                <p className="text-white">{new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
                })}</p>
            </div>
        </section>
    )
}