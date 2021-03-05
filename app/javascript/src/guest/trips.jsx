import React, { useState, useEffect } from 'react';
import { authenticate, fetchBookingsIndex, Spinner, sortArray } from '@utils/tools';
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

    useEffect(() => {        
        handleBookings()
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
        const sort = e.currentTarget.attributes[1].value

        const sortedBookings = sortArray(bookings, sort)
        setBookings(sortedBookings)
        setKey(Math.random())
    }
    

    function showUpcoming (e) {
        setShowBookings("upcoming")
        setKey( Math.random() )
    }
    
    function showAll (e) {
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
                                        <th scope="col"><span className="noselect">Item</span></th>
                                        <th scope="col"><span type="button" value="prop_city" onClick={handleSort}><span className="noselect">City</span></span></th>
                                        <th scope="col"><span type="button" value="start_date" onClick={handleSort}><span className="noselect">Start Date</span></span></th>
                                        <th scope="col"><span type="button" value="end_date" onClick={handleSort}><span className="noselect">End Date</span></span></th>
                                        <th scope="col"><span type="button" value="charge" onClick={handleSort}><span className="noselect">Payment</span></span></th>
                                        <th scope="col"><span type="button" value="status" onClick={handleSort}><span className="noselect">Trip Status</span></span></th>
                                    </tr>
                                </thead>
                                <tbody key={key}>
                                {bookings.map((booking, index) => {
                                    const item = index + 1
                                    const city = booking.prop_city.toUpperCase()
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
                                <button className="btn btn-sm bg-dark text-light ml-auto mr-2" onClick={showUpcoming}>Show Active</button>
                                <button className="btn btn-sm bg-dark text-light" onClick={showAll}>Show All</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    } else {
        return <Spinner />
    }

}