import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import { fetchHostBookingsIndex, Spinner, sortArray } from '@utils/tools';
import { AuthContext, AuthProvider, useAuth } from '@utils/authContext';
import { AuthenticatedApp } from '@src/authenticatedApp';
import { UnauthenticatedApp } from '@src/unauthenticatedApp';


export const HostBookings = (props) => {
    const user = useAuth()
    const [ bookings, setBookings ] = useState([])
    const [ showBookings, setShowBookings ] = useState("all")
    const [ loaded, setLoaded ] = useState(false)
    const [ key, setKey ] = useState(0)
    

    useEffect(() => {        
        handleHostBookings()
    }, [])

    async function handleHostBookings() {
        const fetch = await fetchHostBookingsIndex(user.user_id)
        await console.log("Host bookings Fetch: ", fetch)
        await fetch.bookings.length > 0 && setBookings(fetch.bookings)
        await setLoaded(true)
    }

    function handleClick(e) {   
    }
    
    async function handleSort(e) {      
        const sort = e.currentTarget.attributes[1].value

        const sortedBookings = await sortArray(bookings, sort)
        await setBookings(sortedBookings)
        await setKey(Math.random())
    }


    function showAll() {
        setShowBookings("all")
        setKey(Math.random())
    }

    function showUpcoming() {
        setShowBookings("upcoming")
        setKey(Math.random())
    }

    if (loaded) {
        return (
            <div className="container"> 
            <div className="row">
                <div className="mt-4 ml-4">
                    <p style={{ fontWeight: "700", fontSize: "1.5rem" }}>Guest Bookings: </p>
                </div>
            </div>
            <div className="row">
                <div className="mt-2 col-8 mx-auto border rounded bg-light pt-4 pb-0 px-4">
                    <table className="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Item</th>
                                <th scope="col"><span type="button" value="prop_title" onClick={handleSort}><span className="noselect">Listing</span></span></th>
                                <th scope="col"><span type="button" value="start_date" onClick={handleSort}><span className="noselect">Start Date</span></span></th>
                                <th scope="col"><span type="button" value="end_date" onClick={handleSort}><span className="noselect">End Date</span></span></th>
                                <th scope="col"><span type="button" value="username" onClick={handleSort}><span className="noselect">Guest</span></span></th>
                                <th scope="col"><span type="button" value="charge" onClick={handleSort}><span className="noselect">Payment</span></span></th>
                                <th scope="col"><span type="button" value="status" onClick={handleSort}><span className="noselect">Trip Status</span></span></th>
                                <th scope="col"><span type="button" value="id" onClick={handleSort}><span className="noselect">Booking ID</span></span></th>
                            </tr>
                        </thead>
                        <tbody key={key} >
                        {bookings.map((booking, index) => {
                            const item = index + 1
                            const listing = booking.prop_title
                            const start = booking.start_date
                            const end = booking.end_date
                            const bookingId = booking.id
                            const guest = booking.username
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
                                        <td style={{ fontWeight: "600" }}>{listing}</td>
                                        <td>{start}</td>
                                        <td>{end}</td>
                                        <td>{guest}</td>
                                        <td>{payStatus}</td>
                                        <td>{bookingStatus}</td>
                                        <td>{bookingId}</td>
                                    </tr>
                                )
                            }

                            if (showBookings == "upcoming") {
                                if (today < startDate && bookingStatus !== "Cancelled")  {
                                    return (
                                        <tr key={bookingId} scope="row" onClick={handleClick} value={bookingId} className={statusAttr} >
                                            <td>{item}</td>
                                            <td style={{ fontWeight: "600" }}>{listing}</td>
                                            <td>{start}</td>
                                            <td>{end}</td>
                                            <td>{guest}</td>
                                            <td>{payStatus}</td>
                                            <td>{bookingStatus}</td>
                                            <td>{bookingId}</td>
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
///have bookings list similarly to Trips component///