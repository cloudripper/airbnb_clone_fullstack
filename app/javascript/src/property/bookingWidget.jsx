// bookingWidget.jsx
import React from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import { Link } from 'react-router-dom';
import { initiateStripeCheckout } from '@utils/tools';
import { AuthContext } from '@utils/authContext';


import 'react-dates/lib/css/_datepicker.css';

class BookingWidget extends React.Component {
  static contextType = AuthContext
  state = {
    authenticated: false,
    startDate: null,
    endDate: null,
    existingBookings: [],
    focusedInput: null,
    loading: false,
    error: false,
  }

  componentDidMount() {
    const user = this.context
    console.log(user)
    this.setState({
      authenticated: user.authenticated
    })
    this.getPropertyBookings();
  }
  
  getPropertyBookings = () => {
    fetch(`/api/properties/${this.props.property_id}/bookings`)
      .then(handleErrors)
      .then(data => {
        console.log(data);
        this.setState({
          existingBookings: data.bookings.filter(booking => booking.status != "Cancelled"),
        })
      })
  }

  submitBooking = (e) => {
    if (e) { e.preventDefault(); }
    const { startDate, endDate } = this.state;
    
    fetch(`/api/bookings`, safeCredentials({
      method: 'POST',
        body: JSON.stringify({
          booking: {
            property_id: this.props.property_id,
            start_date: startDate.format('MMM DD YYYY'),
            end_date: endDate.format('MMM DD YYYY'),
          }
        })
    }))
      .then(handleErrors)
      .then(response => {
        const status = initiateStripeCheckout(response.booking.id);
        if (!status) {
          console.log("STATUS:   ", status)
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  

  rescindBooking() {
    console.log("rescind")
  }

  

  onDatesChange = ({ startDate, endDate }) => this.setState({ startDate, endDate })
  onFocusChange = (focusedInput) => this.setState({ focusedInput })
  isDayBlocked = day => this.state.existingBookings.filter(b => day.isBetween(b.start_date, b.end_date, null, '[)')).length > 0


  render () {
    const { authenticated, startDate, endDate, focusedInput } = this.state;
    if (!authenticated) {
      return (
        <div className="border p-4 mb-4">
          Please <Link to={`/login?redirect_url=${window.location.pathname}`}>log in</Link> to make a booking.
        </div>
      );
    };
  
    const { price_per_night } = this.props;
  
    let days;
    if (startDate && endDate) {
      days = endDate.diff(startDate, 'days');
    }
  
    return (
      <div className="border p-4 mb-4">
        <form onSubmit={this.submitBooking}>
          <h5>${price_per_night} <small>per night</small></h5>
          <hr/>
          <div style={{ marginBottom: focusedInput ? '400px': '2rem' }}>
            <DateRangePicker
              startDate={startDate} // momentPropTypes.momentObj or null,
              startDateId="start_date" // PropTypes.string.isRequired,
              endDate={endDate} // momentPropTypes.momentObj or null,
              endDateId="end_date" // PropTypes.string.isRequired,
              onDatesChange={this.onDatesChange}
              focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
              isDayBlocked={this.isDayBlocked} // block already booked dates
              numberOfMonths={1}
            />
          </div>
          {days && (
            <div className="d-flex justify-content-between">
              <p>Total</p>
              <p>${(price_per_night * days).toLocaleString()}</p>
            </div>
          )}
          <button type="submit" className="btn btn-large btn-danger btn-block">Book</button>
        </form>
      </div>
    )
  }
}
export default BookingWidget;