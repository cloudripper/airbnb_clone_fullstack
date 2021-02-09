import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import Layout from '@src/layout';
import { LoginRoute, SignupRoute } from '@src/login';
import { PropertyRoute } from '@src/property';
import { Home } from './home'

import './home.scss';

const App = (props) => {
  const [ userData, setUserData ] = useState(null)
  const [ user, setUser ] = useState(null)
  const [ isAuth, setIsAuth ] = useState(false)

  useEffect(() => {
    fetch("/api/authenticated")
    .then(handleErrors)
    .then(data => {
      if (data.authenticated) {
        setUser(data)
        setIsAuth(true)
        console.log("success ", data)
      } else {
        setUser(null)
        setIsAuth(false)
      }
    })
  }, [])


  function handleLogout(e) {
    if (e) { e.preventDefault(); }

    fetch('/api/sessions', safeCredentials({
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }))
      .then(handleErrors)
      .then(data => {
        console.log(data);
        if (data.success) {
          window.location = '/';
          console.log("Logout complete");
        }
      })
      .catch(error => {
        console.log("error: Something went wrong. ", error)
    })
  }
  

  //useEffect(() => {
  //  if (userData) {
  //    setUser(userData.username)
  //  }
  //}, [isAuth])

  return (
    <Router>
      <Layout key={user} user={user} logout={handleLogout} >   
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" ><LoginRoute /></Route>
          <Route exact path="/sign-up" component={SignupRoute} />
          <Route exact path="/property/:id" component={PropertyRoute} />
          <Redirect from="/*" to="/" />
        </Switch>
      </Layout>
    </Router>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.body.appendChild(document.createElement('div')),
  )
})