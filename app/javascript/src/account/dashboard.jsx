import React, { useState, useEffect } from 'react';
import { authenticate, fetchBookingsIndex } from '@utils/tools';
import { Trips } from '@src/guest/trips';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from '@utils/authContext';





export const Dashboard = (props) => {
const [ username, setUsername ] = useState('')
const [ email, setEmail ] = useState('')
const [ userId, setUserId ] = useState('')
const [ userView, setUserView ] = useState("Travelling")
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
                <h1 className="mt-5 mr-auto">Account</h1>
                <p className="mb-4 mr-auto">{username}, {email} - <Link to={`/users/show/${userId}`}>Go to Profile</Link></p>
                <div className="d-flex justify-content-center">
                    <div className="flex-item border rounded bg-light mx-2 px-2 py-2">
                        <p className="mx-auto" style={{ fontWeight: "700" }}>Trips</p>
                        <p>Upcoming Trips: {tripCount}</p>
                        <p>Trips Taken: {pastCount}</p>
                    </div>
                    <div className="flex-item border rounded bg-light mx-2 px-2 py-2">
                        <p className="mx-auto" style={{ fontWeight: "700" }}>Personal Info</p>
                        <p>Provide personal details and how we can reach you</p>
                    </div>
                    <div className="flex-item border rounded bg-light mx-2 px-2 py-2">
                        <p className="mx-auto" style={{ fontWeight: "700" }}>Listings</p>
                        <p>Upcoming Bookings: --</p>
                        <p>Total Properties Listed: --</p>
                    </div>
                </div>

            </div>
        )
    } else {
        return <p>Loading</p>
    }
}