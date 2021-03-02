import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import { authenticate } from '@utils/tools';
import { AuthContext, AuthProvider, useAuth } from '@utils/authContext';
import { AuthenticatedApp } from '@src/authenticatedApp';
import { UnauthenticatedApp } from '@src/unauthenticatedApp';

import './home.scss';


const App = (props) => {
  const user = useAuth()

  useEffect(() => {
  //  handleLogin()
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
          setUser(null)
          window.location = '/';
          console.log("Logout complete");
        }
      })
      .catch(error => {
        console.log("error: Something went wrong. ", error)
    })
  }

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp /> 
  
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
    document.body.appendChild(document.createElement('div')),
  )
})