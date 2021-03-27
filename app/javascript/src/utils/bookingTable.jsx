import React, { useState } from 'react';
import { sortArray, destroyBooking, initiateStripeRefund } from '@utils/tools';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import '../property/property.scss';

export const BookingTable = (props) => {
    const { handleBookings } = props
    const [ key, setKey ] = useState(0)
    const [ display, setDisplay ] = useState(props.display)
    const [ showBookings, setShowBookings ] = useState("all")
    const [ bookings, setBookings ] = useState(props.passBookings)
    const history = useHistory()

    function handleClick(e) {   
        const id = e.target.parentElement.attributes[1].value
        if (display == "Guest") {
            const path = `/booking/${id}/success`    
            history.push(path)
        }
        if (display == "Host") {
            const path = `/users/show/${id}`    
            history.push(path)
        }
    }
  
    async function handleDelete(e) {   
        e.stopPropagation()
        const bookingId = $(e.target).closest("tr").attr("id")
        console.log(bookingId)
        $(`#primBooking${bookingId}`).addClass("d-none")
        $(`#secBooking${bookingId}`).removeClass("d-none")
    }

    async function handleDeleteConfirm(e) {
        e.stopPropagation()
        const bookingId = $(e.target).closest("tr").attr("id")

        if (display == "Guest") {
            const refund = await initiateStripeRefund(bookingId)
            if (await refund) {
                const booking = await destroyBooking(bookingId)    
                if (await booking) {
                    handleBookings()
                }
            }
        }
        
        if (display == "Host") {
            const refund = await initiateStripeRefund(bookingId)
            if (await refund) {
                const booking = await destroyBooking(bookingId)    
                if (await booking) {
                    handleBookings()
                }
            }
        }
    }
    
    async function handleDeleteCancel(e) {
        e.stopPropagation()
        const bookingId = $(e.target).closest("tr").attr("id")
        $(`#primBooking${bookingId}`).removeClass("d-none")
        $(`#secBooking${bookingId}`).addClass("d-none")
    }

    function handleHoverOver(e) {
        $(e.target).closest("tr").addClass("deleteBkgd")
    }
    function handleHoverOff(e) {
        $(e.target).closest("tr").removeClass("deleteBkgd")
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

    const NoTable = () => {
        return <div>No Bookings</div>
    }

    const Table = () => {
        return ( 
                <table className="table table-responsive-lg table-sm table-hover styleContainer pb-3  pb-lg-0">
                    <thead>
                        <tr>
                            <th scope="col">Item</th>
                            <th scope="col"><span type="button" value={(display == "Host") ? "prop_title" : "prop_city"} onClick={handleSort}><span className="noselect">{(display == "Host") ? "Listing" : "City"}</span></span></th>
                            <th scope="col"><span type="button" value="start_date" onClick={handleSort}><span className="noselect">Start Date</span></span></th>
                            <th scope="col"><span type="button" value="end_date" onClick={handleSort}><span className="noselect">End Date</span></span></th>
                            {(display == "Host") ? <th scope="col"><span type="button" value="username" onClick={handleSort}><span className="noselect">Guest</span></span></th> : null}
                            <th scope="col"><span type="button" value="charge" onClick={handleSort}><span className="noselect">Payment</span></span></th>
                            <th scope="col"><span type="button" value="status" onClick={handleSort}><span className="noselect">Trip Status</span></span></th>
                            {(display == "Host") ? <th scope="col"><span type="button" value="id" onClick={handleSort}><span className="noselect">Total Value</span></span></th> : null}
                            <th scope="col"><span type="button" value="delete"><span className="noselect"></span></span></th>
                        </tr>
                    </thead>
                    <tbody key={key} >
                    {bookings.map((booking, index) => {
                        const item = index + 1
                        const listing = booking.prop_title
                        const city = booking.prop_city.toUpperCase()
                        const start = booking.start_date
                        const end = booking.end_date
                        const bookingId = booking.id
                        const charge = booking.charge[0].amount
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
                                <tr key={bookingId} scope="row" id={bookingId} onClick={handleClick} value={(display == "Host") ? booking.user_id : bookingId} className={statusAttr} >
                                    <td className="pl-3">{item}</td>
                                    <td style={{ fontWeight: "600" }}>{(display == "Host") ? listing : city}</td>
                                    <td>{start}</td>
                                    <td>{end}</td>
                                    {(display == "Host") ? <td>{guest}</td> : null}
                                    <td>{payStatus}</td>
                                    <td>{bookingStatus}</td>
                                    {(display == "Host") ? <td>${charge}</td> : null}
                                    <td className="text-center noHover pr-3" id={`primBooking${bookingId}`} ><FontAwesomeIcon id="tableDelete" onClick={handleDelete} onMouseEnter={handleHoverOver} onMouseLeave={handleHoverOff}  type="button" icon={faTimesCircle} /></td>
                                    <td className="text-center d-none pr-3" id={`secBooking${bookingId}`}><button onClick={handleDeleteConfirm} onMouseEnter={handleHoverOver} onMouseLeave={handleHoverOff} className='py-0 deleteBtns btn btn-sm btn-danger mr-2'>Confirm</button><button onClick={handleDeleteCancel} className='py-0 deleteBtns btn btn-sm btn-secondary'>Cancel</button></td>
                                </tr>
                            )
                        }

                        if (showBookings == "upcoming") {
                            if (today < startDate && bookingStatus !== "Cancelled")  {
                                return (
                                    <tr key={bookingId} scope="row" id={bookingId} onClick={handleClick} value={(display == "Host") ? booking.user_id : bookingId} className={statusAttr} >
                                        <td>{item}</td>
                                        <td style={{ fontWeight: "600" }}>{(display == "Host") ? listing : city}</td>
                                        <td>{start}</td>
                                        <td>{end}</td>
                                        {(display == "Host") ? <td id={booking.user_id}>{guest}</td> : null}
                                        <td>{payStatus}</td>
                                        <td>{bookingStatus}</td>
                                        {(display == "Host") ? <td>${charge}</td> : null}
                                        <td className="text-center noHover" id={`primBooking${bookingId}`} ><FontAwesomeIcon id="tableDelete" onClick={handleDelete} onMouseEnter={handleHoverOver} onMouseLeave={handleHoverOff}  type="button" icon={faTimesCircle} /></td>
                                        <td className="text-center d-none" id={`secBooking${bookingId}`}><button onClick={handleDeleteConfirm} onMouseEnter={handleHoverOver} onMouseLeave={handleHoverOff} className='py-0 deleteBtns btn btn-sm btn-danger mr-2'>Confirm</button><button onClick={handleDeleteCancel} className='py-0 deleteBtns btn btn-sm btn-secondary'>Cancel</button></td>
                                    </tr>
                                )
                            }   
                        }
                    })}
                    </tbody>
                </table>

    )
    }




    return (
        <div className="container"> 
            <div className="bookingListLayout light text-dark mt-4 pt-4 pb-5">
                <div className="col-10 px-0 mx-auto row">
                    <p style={{ fontWeight: "700", fontSize: "1.5rem" }}>{(display == "Host") ? "Guest Bookings: " : "Your Trips: "}</p>
                </div>        
            <div className="row mb-5 pb-5">
            <div className="mt-2 col-10 mx-auto border styleContainer rounded bg-light pt-4 pb-0 px-4">
                {(bookings.length > 0) ? <Table/> : <NoTable/>}
                <div className="d-flex mt-4 mb-4">
                    <button className="btn btn-sm bg-dark text-light ml-auto mr-2" onClick={showUpcoming}>Show Active</button>
                    <button className="btn btn-sm bg-dark text-light" onClick={showAll}>Show All</button>
                </div>
            </div>
        </div>
        </div>
    </div>
    )
}