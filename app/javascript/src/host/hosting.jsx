import React, { useState, useEffect, useRef } from 'react';
import { authenticate, fetchBookingsIndex, subscribeHost } from '@utils/tools';
import { Trips } from '@src/guest/trips';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from '@utils/authContext';


export const Hosting = (props) => {
    const user = useAuth()
    const [ isHost, setIsHost ] = useState((user) ? user.host_status : null)
    const [ isAuth, setIsAuth ] = useState((user) ? user.authenticated : null)

    useEffect(() => {
     //   let isMounted = true;
     //   authenticate().then(auth => { 
     //       if (isMounted) loadHost(auth)
     //   })
     //   return () => { isMounted = false };
    }, [])

    //async function loadHost(auth) {
   //     if (auth.authenticated && auth.host_status) {
   //         setIsHost(true)
   //     }   else {
   //         console.log("Not Host")
   //     }
   //     setIsAuth(auth.authenticate)
    //}


    //function becomeHost() {
    //    if (isAuth) {
//
    //    } else {
    //        console.log('not auth')
    //    }
    //}


    if (isHost) {
        return (
            <div className="container vh-100">
                <h1 className="mt-5 mr-auto">Listings Dashboard</h1>
                <p className="mb-4 mr-auto">{user.username}, {user.email} - <Link to={`/users/show/${user.user_id}`}>Go to Profile</Link></p>
                <div className="d-flex justify-content-center">
                    <Link to={`/hosting/${user.user_id}/listings`} className="text-decoration-none"><div className="flex-item border rounded bg-light mx-2 px-2 py-2" >
                        <p className="mx-auto" style={{ fontWeight: "700" }}>Listings</p>
                        <p>Upcoming Bookings: --</p>
                        <p>Total Properties Listed: --</p>
                    </div></Link>
                    <Link to={`/hosting/${user.user_id}/bookings`} className="text-decoration-none"><div className="flex-item border rounded bg-light mx-2 px-2 py-2" >
                        <p className="mx-auto" style={{ fontWeight: "700" }}>Manage Bookings</p>
                        <p>Calendar</p>
                    </div></Link>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container vh-100"> 
                <div className="d-flex">
                    <div className="flex-item my-5">
                        <h3 className="mt-5">Become a host</h3>
                        <h2 className="mt-3">Host your place</h2>
                        <h2 className="mb-5">and earn extra income.</h2>
                        {(()=>{
                            if (!isAuth) {
                                return <Link className="" to="/sign-up" ><button className="btn btn-danger py-2" >Get Started</button></Link>
                            } else {
                                return <Link className="" to="/become-a-host" ><button className="btn btn-danger py-2" >Get Started</button></Link>
                            }
                        })()}
                    </div>
                </div>
            </div>
        )
    } 
}

export const BecomeHost = (props) => {
    const user = useAuth()
    const isAccept = useRef(null)
    const [ isAuth, setIsAuth ] = useState((user) ? user.authenticated : false)

    useEffect(() => {
//        let isMounted = true;
//        authenticate().then(auth => { 
//            if (isMounted) {
//                if (auth.authenticated) {
//                    setIsAuth(true)
//                    //setIsAuth(auth.authenticated) 
//                } else {
//                    
//                } 
//            }
//        })
//        return () => { isMounted = false };
    }, [])


    function handleSubmit(e) {
        e.preventDefault()
        if (isAccept.current.checked) {
            console.log(true)
            subscribeHost(user, isAccept.current.checked)
        } 
    }

    if (isAuth) {
        return (
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <h2 className="flex-item mt-5 font-weight-bold">Become a Host</h2>
                    <div className="flex-item border rounded py-4 px-5 mt-4 mb-5">
                        <form onSubmit={handleSubmit}>
                            <h4 className=" mb-3 font-weight-bold">Terms & Conditions</h4>
                            <p className="px-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Viverra accumsan in nisl nisi scelerisque eu ultrices. Fermentum dui faucibus in ornare quam viverra orci. Duis at tellus at urna condimentum mattis. Mi quis hendrerit dolor magna eget. Ut tristique et egestas quis. Lacus sed viverra tellus in hac habitasse. Non curabitur gravida arcu ac. Lacus sed viverra tellus in hac habitasse platea. Felis eget velit aliquet sagittis id consectetur purus ut faucibus. Pellentesque id nibh tortor id. Nunc non blandit massa enim nec dui.
                                <br/>Quis varius quam quisque id diam vel quam. Nulla porttitor massa id neque. Sit amet consectetur adipiscing elit. Faucibus a pellentesque sit amet porttitor eget dolor. Egestas congue quisque egestas diam. Erat velit scelerisque in dictum non consectetur a. Cras tincidunt lobortis feugiat vivamus at augue. Eu augue ut lectus arcu bibendum at. Sapien pellentesque habitant morbi tristique. Et ultrices neque ornare aenean euismod elementum nisi quis. Adipiscing at in tellus integer feugiat scelerisque varius morbi enim. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Sed lectus vestibulum mattis ullamcorper velit sed ullamcorper. Amet porttitor eget dolor morbi non arcu.
                                <br/>Faucibus ornare suspendisse sed nisi lacus sed. Quis lectus nulla at volutpat. Quisque egestas diam in arcu. Eget mi proin sed libero enim sed faucibus turpis. Pulvinar etiam non quam lacus suspendisse faucibus. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit. Elit ut aliquam purus sit amet luctus venenatis lectus. Felis imperdiet proin fermentum leo vel orci porta non. Justo nec ultrices dui sapien. Id eu nisl nunc mi ipsum faucibus vitae aliquet. Egestas quis ipsum suspendisse ultrices. Egestas integer eget aliquet nibh praesent tristique magna. Quis varius quam quisque id diam vel quam elementum. Ipsum dolor sit amet consectetur adipiscing. Ultrices neque ornare aenean euismod elementum nisi. Massa sed elementum tempus egestas. Molestie nunc non blandit massa. Egestas integer eget aliquet nibh praesent tristique magna.
                                <br/>Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Tellus at urna condimentum mattis pellentesque id nibh tortor id. Nascetur ridiculus mus mauris vitae. Volutpat lacus laoreet non curabitur gravida. Vitae aliquet nec ullamcorper sit amet risus nullam eget. Tempus iaculis urna id volutpat lacus laoreet non curabitur. Integer eget aliquet nibh praesent. At quis risus sed vulputate odio. Nisi est sit amet facilisis magna etiam tempor. Sem nulla pharetra diam sit amet nisl. In tellus integer feugiat scelerisque varius morbi enim nunc. Eget egestas purus viverra accumsan in nisl nisi scelerisque eu. Eu augue ut lectus arcu. Fringilla phasellus faucibus scelerisque eleifend donec. In fermentum et sollicitudin ac orci phasellus.
                                <br/>Aenean sed adipiscing diam donec adipiscing. Sed arcu non odio euismod lacinia at quis risus. Id diam maecenas ultricies mi eget mauris pharetra. Sodales ut eu sem integer vitae justo eget magna. Platea dictumst vestibulum rhoncus est pellentesque elit. Tortor at auctor urna nunc. Bibendum neque egestas congue quisque. Quam adipiscing vitae proin sagittis nisl rhoncus. Eget sit amet tellus cras adipiscing. Maecenas accumsan lacus vel facilisis volutpat.
                            </p>
                            <label>By checking this box you agree to the terms and conditions outlined above</label>
                            <input className="mx-3" type="checkbox" id="acceptTerms" ref={isAccept} />
                            <button type="submit" className="btn btn-success">Submit</button>
                        </form>
                    </div>
                </div>
            </div>

        )
    } else {
        return <p>Unauthorized</p>
    }
}