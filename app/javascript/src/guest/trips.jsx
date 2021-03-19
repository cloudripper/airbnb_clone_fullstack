import React, { useState, useEffect } from 'react';
import { fetchBookingsIndex, Spinner } from '@utils/tools';
import { useAuth } from '@utils/authContext';
import { BookingTable } from '@utils/bookingTable';


import '../home.scss';


export const Trips = (props) => {
    const user = useAuth()
    const [ bookings, setBookings ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ viewDisplay, setViewDisplay ] = useState("Guest")

    useEffect(() => {        
        handleBookings()
    }, [])

    async function handleBookings() {
        const userId = user.user_id
        let fetch = await fetchBookingsIndex(userId)
        await setBookings(fetch[1])
        await setLoaded(true)
    }

    if (loaded) {
        return <BookingTable key={bookings} passBookings={bookings} handleBookings={handleBookings} display={viewDisplay} />
    } else {
        return <Spinner />
    }

}