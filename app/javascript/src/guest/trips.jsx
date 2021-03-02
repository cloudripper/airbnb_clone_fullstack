import React, { useState, useEffect } from 'react';
import { authenticate, fetchBookingsIndex } from '@utils/tools';
import Layout from '@src/layout';
import { Redirect, useHistory } from 'react-router-dom';
import { useAuth } from '@utils/authContext';

import '../home.scss';


export const Trips = (props) => {
    const user = useAuth()
    const [ bookings, setBookings ] = useState(null)
    const [ bookingsArray, setBookingsArray ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ key, setKey ] = useState(0)
    const [ citySort, setCitySort ] = useState(null)
    const [ statusSort, setStatusSort ] = useState(null)
    const [ showBookings, setShowBookings ] = useState("all")
    const [ bookingSort, setBookingSort ] = useState(1)
    const history = useHistory()
    const myContext = useAuth()

    useEffect(() => {        
        handleBookings()
        console.log("Trips Context Test: ", myContext)

    }, [])

    async function handleBookings() {
        const userId = user.user_id
        let fetch = await fetchBookingsIndex(userId)
        await setBookingsArray(fetch)
        await setBookings(fetch[1])
        setKey(1)
        await setLoaded(true)
    }

    function handleSort(e) {
        e.preventDefault()
        let keySet = (bookingSort == 1) ? 0 : 1
        setBookings(bookingsArray[keySet])
        setBookingSort(keySet)
        setCitySort(null)
        setKey( Math.random() )
    }

    function sortByCity (e) {
        e.preventDefault()
        

        let sortArray
        if (citySort == "asc" || citySort == "null") {
            sortArray = bookings.slice().sort((a, b) => { 
                const aCity = a.prop_city.toUpperCase()
                const bCity = b.prop_city.toUpperCase()

                if (aCity > bCity) {
                    return 1
                }
                if (aCity < bCity) {
                    return -1
                }
                return 0
            })
            setCitySort("desc")
        } else {
            sortArray = bookings.slice().sort((a, b) => { 
                const aCity = a.prop_city.toUpperCase()
                const bCity = b.prop_city.toUpperCase()

                if (aCity < bCity) {
                    return 1
                }
                if (aCity > bCity) {
                    return -1
                }
                return 0
            }) 
            setCitySort("asc")
        }

        setBookings(sortArray)
        setKey( Math.random() )
    }

    function showUpcoming (e) {
        e.preventDefault()
        setCitySort(null)
        setStatusSort(null)
        setShowBookings("upcoming")
        setKey( Math.random() )
    }
    
    function showAll (e) {
        e.preventDefault()
        setCitySort(null)
        setStatusSort(null)
        setShowBookings("all")
        setKey( Math.random() )
    }


    function handleClick(e) {
        e.preventDefault()
        const id = e.target.parentElement.attributes[1].value
        const path = `/booking/${id}/success`
        
        history.push(path)
    }

    if (loaded) {
        return (
                <div className="container"> 
                    <div className="row">
                        <div className="mt-4 ml-4">
                            <p style={{ fontWeight: "700", fontSize: "1.5rem" }}>Your trips: </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="mt-2 col-8 mx-auto border rounded bg-light pt-4 pb-0 px-4">
                            <table className="table table-sm table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Item</th>
                                        <th scope="col">City</th>
                                        <th scope="col">Start Date</th>
                                        <th scope="col">End Date</th>
                                        <th scope="col">Payment</th>
                                        <th scope="col">Trip Status</th>
                                    </tr>
                                </thead>
                                <tbody key={key}>
                                {bookings.map((booking, index) => {
                                    const item = index + 1
                                    const city = booking.prop_city
                                    const start = booking.start_date
                                    const end = booking.end_date
                                    const bookingId = booking.id
                                    const today = Date.now()
                                    const weekOutlook = today + (86400000 * 7)

                                    const startDate = new Date(start)
                                    let payStatus = booking.charge
                                    let bookingStatus = booking.status
                                    let statusAttr = 'present'

                                    if (booking.charge.length > 0) {
                                        payStatus = (booking.charge[0].status) ? booking.charge[0].status : "No payment"       
                                    } else {
                                        payStatus = "No payment"
                                    }
                                    
                                    if (today > startDate) {
                                        bookingStatus = (payStatus == "Paid") ? "Complete" : "Cancelled"
                                        payStatus = (bookingStatus == "Complete") ? "Paid" : "Cancelled"
                                        statusAttr = (bookingStatus == "Cancelled") ? "cancelled" : "past"
                                    } else if (weekOutlook > startDate && payStatus == "Paid") {
                                        bookingStatus = "Upcoming"
                                        statusAttr = "upcoming"
                                    } else {
                                        statusAttr = (bookingStatus == "Cancelled") ? "cancelled" : "present"
                                    }
                                    
                                    if (showBookings == "all") {
                                        return (
                                            <tr key={bookingId} scope="row" onClick={handleClick} value={bookingId} className={statusAttr} >
                                                <td>{item}</td>
                                                <td style={{ fontWeight: "600" }}>{city}</td>
                                                <td>{start}</td>
                                                <td>{end}</td>
                                                <td>{payStatus}</td>
                                                <td>{bookingStatus}</td>
                                            </tr>
                                        )
                                    }
                                    
                                    if (showBookings == "upcoming") {
                                        if (today < startDate && bookingStatus !== "Cancelled")  {
                                            return (
                                                <tr key={bookingId} scope="row" onClick={handleClick} value={bookingId} className={statusAttr} >
                                                    <td>{item}</td>
                                                    <td style={{ fontWeight: "600" }}>{city}</td>
                                                    <td>{start}</td>
                                                    <td>{end}</td>
                                                    <td>{payStatus}</td>
                                                    <td>{bookingStatus}</td>
                                                </tr>
                                            )
                                        }   
                                    }
                                })}
                                </tbody>
                            </table>
                            <div className="d-flex mt-4 mb-4">
                                <button className="btn btn-sm bg-dark text-light ml-auto mr-2" onClick={handleSort}>Sort by Start Date</button>
                                <button className="btn btn-sm bg-dark text-light mr-2" onClick={sortByCity}>Sort by City</button>
                                <button className="btn btn-sm bg-dark text-light mr-2" onClick={showUpcoming}>Show Active</button>
                                <button className="btn btn-sm bg-dark text-light" onClick={showAll}>Show All</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    } else {
        return <p>Loading</p>
    }

}