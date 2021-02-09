// layout.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

library.add(far, faBars, faUserCircle)

import './home.scss';



const Layout = (props) => {
  const userObj = props.user
  const [ user, setUser ] = useState(null)
  const [ hasMounted, setHasMounted ] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  useEffect(() => {
    if (userObj) {
      setUser(userObj.username)
    }
  }, [userObj])


  if (hasMounted) {
    return (
      <React.Fragment>
          <nav className="navbar navbar-expand navbar-light bg-light">
            <a href="/"><span className="navbar-brand mb-0 h1 text-danger">Airbnb</span></a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/">Home</a>
                </li>
              </ul>
            </div>
            {(() => { 
              if (hasMounted) {
                if (user) {
                  return (
                    <div className="navbar-nav navbar-right dropdown">
                      <a href="#" id="loginNav" className="navProfile dropdown-toggle mr-5" data-toggle="dropdown" role="button" aria-expanded="false"><FontAwesomeIcon id="usrBars" className="mr-2" icon={faBars} /><FontAwesomeIcon id="usrImg" icon={["far", "user-circle"]} /></a>
                      <ul className="dropdown-menu dropdown-menu-right pl-2 mr-auto" id="navMenu" role="menu">
                        <li className="mb-2"><NavLink to="/sign-up" activeStyle={{fontWeight: "bold", color: "black"}}>Messages</NavLink></li>
                        <li className="mb-2"><NavLink to="/login" activeStyle={{fontWeight: "bold", color: "black"}}>Notifications</NavLink></li>
                        <li className="mb-2"><NavLink to="/login" activeStyle={{fontWeight: "bold", color: "black"}}>Trips</NavLink></li>
                        <li className="mb-2"><NavLink to="/login" activeStyle={{fontWeight: "bold", color: "black"}}>Saved</NavLink></li>
                        <li role="presentation" className="dropdown-divider"></li>
                        <li className="mb-2"><a disabled href="#">Manage Listings</a></li>
                        <li className="mb-2"><a disabled href="#">Host an experience</a></li>
                        <li className="mb-2"><a disabled id="log-out" href="#" >Account</a></li>                 
                        <li role="presentation" className="dropdown-divider"></li>
                        <li className="mb-2"><a disabled id="log-out" href="#" >Help</a></li>
                        <li ><a id="log-out" href="#" onClick={props.logout}>Log out</a></li>
                      </ul>
                    </div>
                )} else {
                  return ( 
                  <div className="navbar-nav navbar-right dropdown">
                    <a href="#" className="navProfile dropdown-toggle mr-5" data-toggle="dropdown" role="button" aria-expanded="false"><FontAwesomeIcon id="usrBars" className="mr-2" icon={faBars} /><FontAwesomeIcon id="usrImg" icon={["fas", "user-circle"]} /></a>
                    <ul className="dropdown-menu dropdown-menu-right pl-2 mr-auto" id="navMenu" role="menu">
                      <li className="mb-2"><NavLink to="/sign-up" activeStyle={{fontWeight: "bold", color: "black"}}>Sign Up</NavLink></li>
                      <li className="mb-2"><NavLink to="/login" activeStyle={{fontWeight: "bold", color: "black"}}>Login</NavLink></li>
                      <li role="presentation" className="dropdown-divider"></li>
                      <li className="mb-2"><a disabled href="#">Host your home</a></li>
                      <li className="mb-2"><a disabled href="#">Host an experience</a></li>
                      <li className="mb-2"><a disabled id="log-out" href="#" >Help</a></li>
                    </ul>
                  </div>)
                }
              }
            })()} 
          </nav>
          {props.children}
          <footer className="p-3 bg-light">
            <div>
              <p className="mr-3 mb-0 text-secondary">Airbnb Clone</p>
            </div>
          </footer>
      </React.Fragment>
    );
  } else {
    return null
  }
}

export default Layout;