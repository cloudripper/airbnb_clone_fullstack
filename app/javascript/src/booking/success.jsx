import React, { useState, useEffect } from 'react';
import { authenticate, fetchBooking, Spinner } from '@utils/tools';
import { useHistory, Link } from 'react-router-dom';
import { initiateStripeRefund, initiateStripeUpdate, destroyBooking } from '@utils/tools';
import { handleErrors } from '@utils/fetchHelper';



export const BookingSuccess = (props) => {
    const { match: { params }} = props
    const [ checkIn, setCheckIn ] = useState(null)
    const [ checkOut, setCheckOut ] = useState(null)
    const [ loaded, setLoaded ] = useState(false)
    const [ user, setUser ] = useState(false)
    const [ booking, setBooking ] = useState(null)
    const [ upcoming, setUpcoming ] = useState(false)
    const [ charge, setCharge ] = useState(0)
    const [ chargeStatus, setChargeStatus ] = useState(0)
    const [ bookingStatus, setBookingStatus ] = useState(null)
    const [ pricePerNight, setPricePerNight ] = useState(0)
    const [ daysBooked, setDaysBooked ] = useState(0)
    const [ key, setKey ] = useState(0)
    const history = useHistory()


    useEffect(() => {
        confirmAuth()
    }, [])

    async function confirmAuth() {
        const auth = await authenticate()
        const booking = await fetchBooking(auth.user_id, params.id)
        fetchCharge(auth.user_id, params.id)
        const today = Date.now()
        if (await booking) {
            const start = new Date(booking.start_date)
            let switchStatus = ''
            setBookingStatus(booking.status)
            if (today < start) {
                setUpcoming(true)
            }

            setCheckOut(booking.end_date)
            setChargeStatus((!booking.charge_status) ? 'No payment' : booking.charge_status)
            setBooking(booking)
            setUser(auth.username)
            setCheckIn(booking.start_date)
            setCheckOut(booking.end_date)
            setCharge(booking.charges)
            setPricePerNight(booking.price_per_night)
            setDaysBooked(booking.days_booked)
            setLoaded(true)
        } else {
            const path = "/"
            history.push(path)
        }       
    }

    async function fetchCharge(userId, bookingId) {
        return await fetch(`/api/charges/${bookingId}`)
        .then(handleErrors)
        .then(data => {
            return data;
          }
        ).catch(error => console.log(error.message))
    } 

    async function handleCancel(e) {
        const bookingId = e.target.id
        const refund = await initiateStripeRefund(bookingId)
        const cancelBooking = (await refund) && await destroyBooking(bookingId)
        if (await cancelBooking) {
            window.location = `/booking/${bookingId}/success`  
        }
        
    }

    async function handlePayment(e) {
        await initiateStripeUpdate(e.target.id)
    }

//LOAD 
    if (loaded) {
        return (
            <div className="container" key={key}>
            <div className="mt-4">
                <p style={{ fontWeight: "700", fontSize: "1.5rem" }}>{bookingStatus}: {daysBooked} Nights in {booking.prop_city}, {booking.prop_country}</p>
                <div className="d-flex justify-content-between">
                    <p className="flex-item">Booked by: {user}</p>
                    <p className="flex-item">Order Status: {chargeStatus}</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="flex-item">Date of Booking: {booking.created_at}</p>
                    <p className="flex-item">Order Number: {booking.id}</p>
                </div>
            </div>
            <div className="row mb-5 pb-3">
                <div className="col-12 col-md-9 col-lg-6 mx-auto my-4">
                    <div className="border rounded p-4 d-flex justify-content-around align-items-center">
                            <div className="flex-item ">
                                <p style={{ fontWeight: "700" }}>Check-in: </p>
                                <p className="ml-2">{checkIn}</p>
                            </div>
                            <div className="flex-item" style={{ color: "lightGray", fontSize: "1.5rem" }}>&#62;</div>
                            <div className="flex-item ">
                                <p style={{ fontWeight: "700" }}>Check-out: </p>
                                <p className="ml-2">{checkOut}</p>
                            </div>
                    </div>
                    <div className="border rounded p-4">
                            <div>
                            <p style={{ fontWeight: "700", fontSize: "1.2rem" }}>{booking.prop_type}</p>
                                <Link className="linkStyle" to={`/property/${booking.property_id}`}>{booking.prop_title}</Link>
                                <p className="mt-3">1234 Fake St., {booking.prop_city}</p>
                                <p>Hosted by: {booking.prop_host}</p> 
                                <p>Contact: {booking.prop_host_contact}</p> 
                            </div>
                    </div>    
                </div>
                <div className="col-12 col-md-9 col-lg-6 mx-auto my-4">
                    <div className="border rounded p-4 ">
                        <p style={{ fontWeight: "700" }}>Charges</p>
                        <div className="d-flex justify-content-between">
                            <p className="flex-item ml-2">${pricePerNight} x {daysBooked}</p>
                            <p className="flex-item mr-2">{charge}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="flex-item ml-2">Airbnb service fee (includes VAT)</p>
                            <p className="flex-item mr-2">0.00</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="flex-item ml-2">State/Local Tax</p>
                            <p className="flex-item mr-2">0.00</p>
                        </div>
                        <div className="d-flex justify-content-between bg-light py-2">
                            <p className="flex-item ml-2 my-1" style={{ fontWeight: "700" }}>Total</p>
                            <p className="flex-item mr-2 my-1">${charge}</p>
                        </div>
                    </div>
                    {(() => {
                        if (upcoming) {
                            let button = ''
                            
                            switch(chargeStatus) {
                                case "No payment":
                                    button = <button onClick={handlePayment} id={booking.id} className="btn btn-success">Confirm Payment</button>;
                                    break;
                                case "Pending":
                                    button = <button onClick={handlePayment} id={booking.id} className="btn btn-success">Confirm Payment</button>;
                                    break;
                                case "Refunded":
                                    button = 'Refund complete. Order closed.'
                                    break;
                                default:
                                    button = <button onClick={handleCancel} id={booking.id} className="btn btn-danger">Cancel Booking</button>
                            }
                            
                            return <div className="border rounded mt-4 p-4 d-flex justify-content-center">{button}</div>
                        } 
                    })()}
                </div>
            </div>
            </div>
        )
    } else {
        return <Spinner />
    }
}