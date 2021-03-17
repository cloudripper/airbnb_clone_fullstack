import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { UnauthLayout } from '@src/layout';
import { LoginRoute, SignupRoute } from '@src/login';
import { PropertyRoute } from '@src/property';
import { Home } from './home'
import { Hosting } from './host/hosting'

import './home.scss';


export const UnauthenticatedApp = (props) => {

  useEffect(() => {
            let isMounted = true;
            console.log("Unauth app")
            return () => { isMounted = false };
        }, [])

    return (
      <Router> 
        <UnauthLayout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" ><LoginRoute /></Route>
            <Route exact path="/sign-up" component={SignupRoute} />
            <Route exact path="/property/:id" component={PropertyRoute} />
            <Route exact path="/become-a-host" component={Hosting} />
            <Redirect from="/users/show/*" to="/login" />
          </Switch>
        </UnauthLayout>
      </Router>
    )
}