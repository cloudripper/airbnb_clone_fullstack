import React from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import {loadStripe} from '@stripe/stripe-js';
import { Redirect } from 'react-router-dom';

import '@utils/spinner.scss'


export async function authenticate() {
    return await fetch("/api/authenticated")
    .then(handleErrors)
    .then(data => {
      //if (data.authenticated) {
      //  return data;
      //} else {

        return data
      //}
      //console.log("JSON: ", JSON.parse(data))
      
      
    }).catch(error => console.log(error))
}


export async function fetchUser(userId) {
  const request = {
    //dataType: 'json',
    // data: JSON.stringify(data)
  }
  return await fetch(`/api/users/show/${userId}`)
  .then(handleErrors)
  .then(data => {
      console.log("Fetch user: ", data)
      return data.user;
    }
  ).catch(error => console.log('Error: ', error))
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


export async function fetchBooking(userId, bookingId) {
    return await fetch(`/api/bookings/${userId}/${bookingId}`)
    .then(handleErrors)
    .then(data => {
        return data.booking;
      }
    ).catch(error => console.log(error.message))
} 

export async function fetchBookingsIndex(userId) {
    return await fetch(`/api/bookings/${userId}`)
    .then(handleErrors)
    .then(data => {
      console.log("Bookings data: ", data)
        let bookings = data.bookings
        const descBookings = bookings.slice().sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        const ascBookings = descBookings.slice().sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
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

export const initiateStripeUpdate = async (booking_id) => {
  return await fetch(`/api/charges/${booking_id}`, safeCredentials({
    method: 'PUT',
  }))
  .then(handleErrors)
  .then(async response => {
    console.log('Resopse: ', response);

    const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
    stripe.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.session_id,
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

export const initiateStripeRefund = async (booking_id) => {
  return await fetch(`/api/charges/${booking_id}`, safeCredentials({
    method: 'DELETE',
  }))
    .then(handleErrors)
    .then(async response => {
          return response
    })
    .catch(error => {
      console.log(error);
    })
}

export const subscribeHost = async (auth, status) => {
  const url = "/api/users/host/" + auth.user_id
  const data = { 
    user: { 
      host_status: status 
    }
  }

  const apiRequest = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
  }

  return await fetch(url, safeCredentials(apiRequest))
  .then(handleErrors).then(data => { 
      if (data.user.host_status) { 
        window.location = `/hosting/${data.user.user_id}/home`
      } else { 
        return data
      }
  }).catch(error => console.log("Error: ", error))   
}



export function Spinner(props) {
  return (    
      <>
          <div className="spinner"/>
          <div className="text-center mt-5"><i>{props.error}</i></div>
      </>
  )
}