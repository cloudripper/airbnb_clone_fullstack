import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthLayout } from '@src/layout';
import { LoginRoute, SignupRoute } from '@src/login';
import { PropertyRoute } from '@src/property';
import { Trips } from '@src/guest/trips';
import { BookingSuccess } from '@src/booking/success';
import { Dashboard } from '@src/account/dashboard';
import { Profile } from '@src/account/profile';
import { Home } from './home'
import { Hosting, BecomeHost } from './host/hosting'
import { Listings } from './host/listings'
import { HostBookings } from './host/bookings'
import { NewListing } from './host/newListing'

export const AuthenticatedApp = () => {
  
  return (
    <Router>
        <AuthLayout >
            <Switch>
                 <Route exact path="/" component={Home} />
                 <Route exact path="/login" ><LoginRoute /></Route>
                 <Route exact path="/sign-up" component={SignupRoute} />
                 <Route exact path="/property/:id" component={PropertyRoute} />
                 <Route exact path="/trips" component={Trips} />
                 <Route exact path="/booking/:id/success" component={BookingSuccess} />
                 <Route exact path="/booking/:id/success" component={BookingSuccess} />
                 <Route exact path="/account" component={Dashboard}/>
                 <Route exact path="/users/show/:id" component={Profile} />
                 <Route path="/hosting/:id/home" component={Hosting} />
                 <Route path="/hosting/:id/listings" component={Listings} />
                 <Route exact path="/hosting/:id/new-listing" component={NewListing} />
                 <Route path="/hosting/:id/bookings" component={HostBookings} />
                 <Route exact path="/become-a-host" component={BecomeHost} />
            </Switch>
        </AuthLayout>
    </Router>
  )
}