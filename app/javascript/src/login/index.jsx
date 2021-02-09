import React from 'react'
import ReactDOM from 'react-dom'
import Login from './login';
import LoginWidget from './loginWidget';
import SignupWidget from './signupWidget';

export const LoginSwap = () => {
  return (
    <Login />
  )
}

export const LoginRoute = (props) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-9 col-lg-6 mx-auto my-4">
          <div className="border p-4">
            <LoginWidget />
          </div>
        </div>
      </div>
    </div>  )
}

export const SignupRoute = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-9 col-lg-6 mx-auto my-4">
          <div className="border p-4">
            <SignupWidget />
          </div>
        </div>
      </div>
    </div>
  )
}
