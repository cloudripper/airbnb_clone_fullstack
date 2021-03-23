import React, { useState, useEffect } from 'react';
import { fetchBookingsIndex } from '@utils/tools';
import { Link } from 'react-router-dom';
import { useAuth } from '@utils/authContext';

export const Dashboard = (props) => {
const [ username, setUsername ] = useState('')
const [ email, setEmail ] = useState('')
const [ userId, setUserId ] = useState('')
const [ isAuth, setIsAuth ] = useState(true)
const [ tripCount, setTripCount ] = useState(0)
const [ pastCount, setPastCount ] = useState(0)
const user = useAuth()


useEffect(() => {
    let isMounted = true;
    loadDash(user)
    return () => { isMounted = false };
}, [])


async function loadDash(auth) {
    if (auth.authenticated) {
        let fetch = await fetchBookingsIndex(auth.user_id)
        const today = Date.now()
        let upcomingTrip = 0
        let pastTrip = 0
        await fetch[0].map((booking) => {
            const start = new Date(booking.start_date)
            if (booking.status == "Confirmed") {
                (start >= today) ? upcomingTrip++ : pastTrip++ 
            }
        })
        await setUsername(auth.username)
        await setEmail(auth.email)
        await setUserId(auth.user_id)
        await setTripCount(upcomingTrip)
        await setPastCount(pastTrip)
        await setIsAuth(true)
    }   else {
        return <p>fail</p>
    }
}

    if (isAuth) {
        return (
            <div className="container vh-100">
                <h1 className="mt-5 mr-auto font-weight-bold">Account</h1>
                <p className="mb-5 mr-auto"><b>{username}</b>, {email} - <Link className="linkStyle" to={`/users/show/${userId}`}>Go to Profile</Link></p>
                <div className="d-flex justify-content-center justify-content-sm-left justify-content-lg-center flex-wrap pb-3 mb-5">
                    <Link to="/trips" className="text-decoration-none text-dark flex-item dashItem bg-light mx-2 px-2 py-2 my-2 my-md-0">
                        <p className="mx-auto font-weight-bold">Trips</p>
                        <p>Upcoming Trips: {tripCount}</p>
                        <p>Trips Taken: {pastCount}</p>
                    </Link>
                    <Link to={`/users/show/${userId}`} className="text-decoration-none text-dark flex-item dashItem bg-light mx-2 px-2 py-2 my-2 my-md-0">
                        <p className="mx-auto font-weight-bold">Personal Info</p>
                        <p>Provide personal details <br/>and how we can reach you</p>
                    </Link>
                    {(() => {
                        return (user.host_status) ? 
                            <Link to={`/hosting/${user.user_id}/home`} className="text-decoration-none text-dark flex-item dashItem bg-light mx-2 px-2 py-2 my-2 my-md-0">
                                <p className="mx-auto font-weight-bold">Listings</p>
                                <p>Upcoming Bookings: --</p>
                                <p>Total Properties Listed: --</p>
                            </Link> 
                            : <Link to={`/hosting/${user.user_id}/home`} className="text-decoration-none text-dark flex-item dashItem bg-light mx-2 px-2 py-2 my-2 my-md-0">
                                <p className="mx-auto font-weight-bold">Become a Host</p>
                                <p>Sign up to become a Host: <br/>Host and Earn!</p>
                            </Link> 
                    })()}
                </div>

            </div>
        )
    } else {
        return <p>Loading</p>
    }
}