import React, { useState, useEffect } from 'react';
import { fetchHostBookingsIndex, Spinner } from '@utils/tools';
import { useAuth } from '@utils/authContext';
import { BookingTable } from '@utils/bookingTable';


export const HostBookings = (props) => {
    const user = useAuth()
    const [ bookings, setBookings ] = useState([])
    const [ viewDisplay, setViewDisplay ] = useState("Host")
    const [ loaded, setLoaded ] = useState(false)


    useEffect(() => {        
        handleHostBookings()
    }, [])

    async function handleHostBookings() {
        const fetch = await fetchHostBookingsIndex(user.user_id)
        await console.log("Host bookings Fetch: ", fetch)
        await fetch.bookings.length > 0 && setBookings(fetch.bookings)
        await setLoaded(true)
    }

    if (loaded) {
        return <BookingTable key={bookings} passBookings={bookings} display={viewDisplay} handleBookings={handleHostBookings} />
    } else {
        return <Spinner />
    }
                    
}