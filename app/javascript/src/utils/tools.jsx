import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import {loadStripe} from '@stripe/stripe-js';
import { Redirect } from 'react-router-dom';


export async function authenticate() {
    return await fetch("/api/authenticated")
    .then(handleErrors)
    .then(data => {
      if (data.authenticated) {
        console.log("success ", data)
        return data;
      } else {
        return false
      }
    })
}

export async function destroyBooking(id) {
  const url = "/api/booking/" + id
  const apiRequest = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
  }
  return await fetch(url, safeCredentials(apiRequest))
  .then(response => response.json()).then(data => { 
      return data
  }).catch(error => console.log("Error: ", error))   
}

export async function updateBookingStatus(id) {
  const url = "/api/booking/" + id
  const apiRequest = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
  }
  return await fetch(url, safeCredentials(apiRequest))
  .then(response => response.json()).then(data => { 
      return data
  }).catch(error => console.log("Error: ", error))   
}



export async function fetchBooking(userId, bookingId) {
    return await fetch(`/api/bookings/${userId}/${bookingId}`)
    .then(handleErrors)
    .then(data => {
        console.log("success, booking data: ", data.booking)
        return data.booking;
      }
    ).catch(error => console.log(error.message))
} 

export async function fetchBookingsIndex(userId) {
    return await fetch(`/api/bookings/${userId}`)
    .then(handleErrors)
    .then(data => {
        console.log("success, booking data: ", data.bookings)
        let bookings = data.bookings
        const descBookings = bookings.slice().sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        const ascBookings = bookings.slice().sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        const bookingsArray = [ascBookings, descBookings]
        return bookingsArray;
      }
    )
} 


export async function initiateStripeCheckout(booking_id) {
  return await fetch(`/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`, safeCredentials({
    method: 'POST',
  }))
    .then(handleErrors)
    .then(async response => {
      const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
      console.log('checkout response ', response)
      stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: response.charge.checkout_session_id,
      }).then((result) => {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        if (result.status.ok) {
          return true
        } else {
          return false
        }
      });
    })
    .catch(error => {
      console.log(error);
      return false
    })
}


//fetch("/api/authenticated")
//.then(handleErrors)
//.then(data => {
//  if (data.authenticated) {
//    setUser(data)
//    setIsAuth(true)
//    console.log("success ", data)
//  } else {
//    setUser(null)
//    setIsAuth(false)
//  }
//})