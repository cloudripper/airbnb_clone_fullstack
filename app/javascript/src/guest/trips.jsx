import React, { useState, useEffect } from 'react';
import { authenticate, fetchBookingsIndex } from '@utils/tools';
import Layout from '@src/layout';
import { Redirect, useHistory } from 'react-router-dom';

import '../home.scss';


export const Trips = (props) => {
    const user = props.user 
    const [ bookings, setBookings ] = useState(null)
    const [ bookingsArray, setBookingsArray ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const history = useHistory()

    useEffect(() => {
        handleBookings()
    }, [])

    async function handleBookings() {
        const userId = user.user_id
        let fetch = await fetchBookingsIndex(userId)
        await setBookingsArray(fetch)
        await setBookings(fetch[1])
        await setLoaded(true)
    }

    function handleSort(e) {
        e.preventDefault()
        setBookings(bookingsArray[0])
        setLoaded(true)
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
                        <div className="mt-5 col-8 mx-auto border rounded bg-light py-4 px-4">
                            <div className="d-flex align-content-around mb-4">
                                <button className="btn btn-sm bg-dark text-light" onClick={handleSort}>Sort</button>
                            </div>
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
                                <tbody>
                                {bookings.map((booking, index) => {
                                    const item = index + 1
                                    const city = booking.prop_city
                                    const start = booking.start_date
                                    const end = booking.end_date
                                    const bookingId = booking.id
                                    const today = Date.now()
                                    const weekOutlook = today + (86400000 * 7)

                                    const startDate = new Date(start)
                                    let payStatus = booking.status
                                    let status = ''
                                    let statusAttr = 'present'

                                    if (booking.status.length > 0) {
                                        if (booking.status[0].status) {
                                            payStatus = booking.status[0].status
                                        } else {
                                            payStatus = "No payment"
                                        }
                                    } else {
                                        payStatus = "No payment"
                                    }
                                    
                                    if (today > startDate) {
                                        statusAttr = "past"
                                        status = (payStatus == "Paid") ? "Complete" : "Cancelled"
                                    } else if (weekOutlook > startDate && payStatus == "Paid") {
                                        status = "Upcoming"
                                        statusAttr = (weekOutlook > startDate) ? "upcoming" : "present"
                                    } else {
                                        switch(payStatus) {
                                            case "Paid":
                                                status = "Confirmed";
                                                break;
                                            case "Refunded":
                                                status = "Cancelled";
                                                break;
                                            default:
                                                status = payStatus;
                                        }
                                        statusAttr = (weekOutlook > startDate) ? "upcoming" : "present"
                                    }

                                    return (
                                        <tr key={bookingId} scope="row" onClick={handleClick} value={bookingId} className={statusAttr} >
                                            <td>{item}</td>
                                            <td style={{ fontWeight: "600" }}>{city}</td>
                                            <td>{start}</td>
                                            <td>{end}</td>
                                            <td>{payStatus}</td>
                                            <td>{status}</td>
                                        </tr>
                                    )
                                        
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        )
    } else {
        return <p>Loading</p>
    }

}