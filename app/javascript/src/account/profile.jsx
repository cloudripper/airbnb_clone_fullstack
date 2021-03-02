import React, { useState, useEffect } from 'react';
import { Trips } from '@src/guest/trips';
import { Link } from 'react-router-dom';
import { authenticate, fetchBooking, destroyBooking, fetchUser } from '@utils/tools';
import { useAuth } from '@utils/authContext';



export const Profile = (props) => {
    const { match: { params }} = props
    const [ identity, setIdentity ] = useState(null)
    const [ username, setUsername ] = useState(null)
    const [ email, setEmail ] = useState(null)
    const [ phone, setPhone ] = useState(null)
    const [ created, setCreated ] = useState(null)
    const user = useAuth()


    useEffect(() => {
        profileUser()
    }, [])

     function profileUser() {
        const dateObj = new Date(user.created_at)
        setUsername(user.username)
        setEmail(user.email)
        setCreated(dateObj.getFullYear())
    }

    return (
        <div className="container vh-100">
            <div className="row mt-5">
                <div className="col-4 border rounded p-4">
                    <img></img>
                    <Link className="mb-4" to='/'>Update Photo</Link>
                    <p className="my-4">Identity not verified</p>
                    <hr/>
                    <h4 className="my-4">{username} not confirmed</h4>
                    <p className="mt-2"><span className="mx-2">{(()=>{return (identity) ? "+" : "x" })()}</span> Identity</p>
                    <p className="mt-2"><span className="mx-2">{(()=>{return (email) ? "+" : "x" })()}</span> Email Address</p>
                    <p className="mt-2"><span className="mx-2">{(()=>{return (phone) ? "+" : "x" })()}</span> Phone Number</p>
                    <p className="mt-2"><Link to="/" disabled>Learn more</Link> more about how confirming account info helps keep the Airbnb community secure.</p>
                </div>
                <div className="col-8">
                    <div className="ml-5">
                        <h1>Hi, I'm {username}</h1>
                        <p>Joined in {created}</p>
                        <Link className="mb-4" to='/'>Edit Profile</Link>
                        <div>
                            <h3>About</h3>
                            <p>    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}