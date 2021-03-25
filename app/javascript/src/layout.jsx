// layout.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle, faBars } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { useAuth, handleLogout } from '@utils/authContext';

library.add(far, faBars, faUserCircle)

import './home.scss';



export const AuthLayout = (props) => {
  const userObj = useAuth()
  const [ user, setUser ] = useState(userObj)
  const [ isHost, setIsHost ] = useState("Become a Host")
  const [ avatar, setAvatar ] = useState(null)

  useEffect(() => {
    setUser(userObj)
    if (userObj) {
      setUser(userObj.username)
      setIsHost((userObj.host_status) ? "Manage Listings" : "Become a Host")
      setAvatar((userObj.image.length != 0) ? <img id="thumbnail" src={`${userObj.image[1].image}`} />: <FontAwesomeIcon className="usrImg" icon={["far", "user-circle"]} />)

    } else {
      console.log("Layout User Error")
    }
  }, [])

  useEffect(() => {
    setAvatar((userObj.image.length != 0) ? <img id="thumbnail" src={`${userObj.image[1].image}`} /> : <FontAwesomeIcon className="usrImg" icon={["far", "user-circle"]} />)
  }, [user])


    return (
      <React.Fragment>
          <nav className="navbar navbar-expand navbar-light bg-light navStyle">
            <a href="/"><span className="navbar-brand mb-0 h1 text-danger">Airbnb</span></a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/">Home</a>
                </li>
              </ul>
            </div>
              <div className="navbar-nav navbar-right dropdown">
                <a href="#" id="loginNav" className="navProfile dropdown-toggle mr-2 mr-md-5" data-toggle="dropdown" role="button" aria-expanded="false"><FontAwesomeIcon id="usrBars" className="mr-2" icon={faBars} />{avatar}</a>
                <ul className="dropdown-menu dropdown-menu-right pl-2 mr-auto" id="navMenu" role="menu">
                  <li className="mb-2"><NavLink to="/trips" activeStyle={{fontWeight: "bold", color: "black"}}>Trips</NavLink></li>
                  <li role="presentation" className="dropdown-divider"></li>
                  <li className="mb-2"><NavLink to={`/hosting/${userObj.user_id}/home`} activeStyle={{fontWeight: "bold", color: "black"}}>{isHost}</NavLink></li>            
                  <li className="mb-2"><NavLink to="/account" activeStyle={{fontWeight: "bold", color: "black"}}>Account</NavLink></li>
                  <li role="presentation" className="dropdown-divider"></li>
                  <li className="mb-2"><a href="https://www.airbnb.com/help/home" >Help</a></li>
                  <li ><a id="log-out" href="#" onClick={handleLogout}>Log out</a></li>
                </ul>
              </div>
          </nav>
          {props.children}
          <footer  className="custFooter fixed-bottom">
            <div id="footer" className="row px-3 py-1 p-sm-3 d-flex bg-light">
              <p className="ml-3 mb-0 text-secondary">Airbnb Clone</p>
              <p className="ml-auto mr-3 mb-0 text-secondary"><small>VW Labs 2021</small></p>
            </div>
          </footer>
      </React.Fragment>
    );
}

export const UnauthLayout = (props) => {
  const [ hasMounted, setHasMounted ] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])
  
  if (hasMounted) {
    return (
      <React.Fragment>
          <nav className="navbar navbar-expand navbar-light bg-light navStyle">
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
                  return ( 
                  <div className="navbar-nav navbar-right dropdown">
                    <a href="#" className="navProfile dropdown-toggle mr-2 mr-md-5" data-toggle="dropdown" role="button" aria-expanded="false"><FontAwesomeIcon id="usrBars" className="mr-2" icon={faBars} /><FontAwesomeIcon className="usrImg" icon={["fas", "user-circle"]} /></a>
                    <ul className="dropdown-menu dropdown-menu-right pl-2 mr-auto" id="navMenu" role="menu">
                      <li className="mb-2"><NavLink to="/sign-up" activeStyle={{fontWeight: "bold", color: "black"}}>Sign Up</NavLink></li>
                      <li className="mb-2"><NavLink to="/login" activeStyle={{fontWeight: "bold", color: "black"}}>Login</NavLink></li>
                      <li role="presentation" className="dropdown-divider"></li>
                      <li className="mb-2"><NavLink to={`/become-a-host`} activeStyle={{fontWeight: "bold", color: "black"}}>Host your home</NavLink></li>
                      <li className="mb-2"><a disabled id="log-out" href="#" >Help</a></li>
                    </ul>
                  </div>)
              }
            })()} 
          </nav>
          {props.children}
          <footer className="custFooter fixed-bottom">
            <div id="footer" className="row px-3 py-1 p-sm-3 d-flex bg-light">
              <p className="ml-3 mb-0 text-secondary">Airbnb Clone</p>
              <p className="ml-auto mr-3 mb-0 text-secondary"><small>VW Labs 2021</small></p>
            </div>
          </footer>
      </React.Fragment>
    );
  } else {
    return null
  }
}