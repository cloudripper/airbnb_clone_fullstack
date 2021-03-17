import React, { useState, useEffect } from 'react';
import { Trips } from '@src/guest/trips';
import { Link } from 'react-router-dom';
import { authenticate, fetchBooking, destroyBooking, fetchUser, MiniSpinner, updateProfileImg, updateProfile, Spinner } from '@utils/tools';
import { useAuth, AuthContext } from '@utils/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'




export const Profile = (props) => {
    const user = useAuth()
    const { match: { params }} = props
    return (user.user_id == parseInt(params.id)) ? <SelfProfile/> : <VisitProfile userId={params.id} />
}

const SelfProfile = (props) => {
    const user = useAuth()
    const [ identity, setIdentity ] = useState(null)
    const [ username, setUsername ] = useState(user.username)
    const [ email, setEmail ] = useState(user.email)
    const [ phone, setPhone ] = useState(null)
    const [ bio, setBio ] = useState(null)
    const [ firstName, setFirstName ] = useState(null)
    const [ lastName, setLastName ] = useState(null)
    const [ image, setImage ] = useState(null)
    const [ created, setCreated ] = useState(null)
    const [ upload, setUpload ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    

    useEffect(() => {
        profileUser()
        console.log(user.image)
    }, [])

     function profileUser() {
        setUsername(user.username)
        setEmail(user.email)
        setPhone((user.phone) ? user.phone : null)
        setBio((user.bio) ? user.bio : null)
        setFirstName((user.first_name) ? user.first_name : null)
        setLastName((user.last_name) ? user.last_name : null)
        setImage((user.image[0]) ? user.image[1].image : "https://via.placeholder.com/300x400")
        const dateObj = new Date(user.created_at)
        setCreated(dateObj.getFullYear())
        setLoading(true)
    
        loadImage()
    }

    function loadImage() {             
        if (user.image[0]) {
            let propImg = new Image()
            
            propImg.onload = () => {
                setImage(propImg.src)
                propImg = null
            }
            propImg.src = user.image[0].image
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        e.target.parentElement.parentElement.parentElement.parentElement.classList.remove("show")
        setUpload(<MiniSpinner/>)
        const imageFile = e.target.files[0]
        const formData = new FormData()
        formData.append('user[images]', imageFile, imageFile.name)
        
        const userUpdate = await updateProfileImg(user, formData)
        if (await userUpdate) {
            window.location=`/users/show/${user.user_id}`
        } else {
            setUpload(<i>Oops! Something went wrong</i>)
        }
    }

    if (!loading) {
        return <Spinner />
    } else {
        return (
            <div className="container vh-100">
                <div className="row mt-5">
                    <div className="col-4 border rounded p-4">
                        <img className="mx-auto d-block img img-responsive mb-4 rounded align-self-center" src={`${image}`} />
                        <p>{upload}</p>
                        <div className="dropdown">
                            <button className="ml-4 btn btn-sm btn-secondary dropdown-toggle" type="button" id="profileDropDown" data-toggle="dropdown" aria-expanded="false">Update Photo</button>
                            <ul className="dropdown-menu py-3 px-3" aria-labelledby="profileDropDown">
                                <form onChange={handleSubmit} >
                                    <div className="form-group mb-0 ">
                                        <li className="text-center mb-3 font-weight-bold "><label>Select a profile image to upload</label></li>
                                        <li className="text-center mb-3 mx-2"><input className="form-control" type="file" id="profilePhoto" accept="image/*" /></li>
                                        <li className="text-center mb-0"><button className="ml-auto">Submit</button></li>
                                    </div>
                                </form>
                            </ul>
                        </div>
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
                            <h1>Hi, I'm {(()=>{ return (firstName) ? firstName : username })()}.</h1>
                            <p>Joined in {created}</p>
                            <Link className="mb-4" to={`/users/edit/${user.user_id}`}>Edit Profile</Link>
                            <div>
                                <h3>About</h3>
                                <p>{(()=>{ return (bio) ? bio : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."})()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const VisitProfile = (props) => {
    const [ visitUser, setVisitUser ] = useState(null)
    const [ identity, setIdentity ] = useState(null)
    const [ username, setUsername ] = useState(null)
    const [ email, setEmail ] = useState(null)
    const [ phone, setPhone ] = useState(null)
    const [ bio, setBio ] = useState(null)
    const [ firstName, setFirstName ] = useState(null)
    const [ lastName, setLastName ] = useState(null)
    const [ image, setImage ] = useState(null)
    const [ created, setCreated ] = useState(null)
    const [ upload, setUpload ] = useState(null)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        console.log(props.userId)
        profileUser()
        //return () => {
        //    setVisitUser(null)
        //}
    }, [])

    
     async function profileUser() {
        const profUser = await fetchUser(props.userId)
        const dateObj = new Date(await profUser.created_at)
        setVisitUser(await profUser)
        setUsername(await profUser.username)
        setEmail(await profUser.email)
        setCreated(await dateObj.getFullYear())
        setImage(await (profUser.image[0]) ? profUser.image[1].image : null)
        setBio(await (profUser.bio) ? profUser.bio : null)
        setFirstName(await (profUser.first_name) ? profUser.first_name : null)
        setLastName(await (profUser.last_name) ? profUser.last_name : null)
        setLoading(await false)
        await loadImage(profUser)
    }

    function loadImage(user) {             
        console.log(user)
        if (user.image[0]) {
            let propImg = new Image()
            
            propImg.onload = () => {
                setImage(propImg.src)
                propImg = null
            }
            propImg.src = user.image[0].image
        }
    }

    if (loading) {
        return <Spinner />
    } else {
        return (
            <div className="container vh-100">
                <div className="row mt-5">
                    <div className="col-4 border rounded p-4">
                        {(image) ? <img className="mx-auto d-block img img-responsive mb-4 rounded align-self-center" src={`${image}`} /> : <FontAwesomeIcon className="mx-auto d-block img img-responsive mb-4 rounded align-self-center" id="avatarProfile" icon={faUser} /> }
                        <p>{upload}</p>

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
                        <h1>Hi, I'm {(()=>{ return (firstName) ? firstName : username })()}.</h1>
                            <p>Joined in {created}</p>
                            <div>
                                <h3>About</h3>
                                <p>{(()=>{ return (bio) ? bio : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."})()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export const EditProfile = (props) => {
    const user = useAuth()
    //const { match: { params }} = props
    //const [ identity, setIdentity ] = useState(null)
    //const [ username, setUsername ] = useState(null)
    //const [ email, setEmail ] = useState(null)
    //const [ phone, setPhone ] = useState(null)
    //const [ created, setCreated ] = useState(null)
    //const [ image, setImage ] = useState(user.image)
    const [ error, setError ] = useState(null)
    
    //useEffect(() => {
    //  
    //}, [])
//
    // function profileUser() {
    //    const dateObj = new Date(user.created_at)
    //    setUsername(user.username)
    //    setEmail(user.email)
    //    setCreated(dateObj.getFullYear())
    //}

    async function handleSubmit(e) {
        e.preventDefault()
        const form = e.target   
        let dataObj = {}
        for (let i = 0; i < e.target.length - 1; i++) {
            if (form[i].value) {
                const dataKey = form[i].id
                dataObj[dataKey] = form[i].value
            }
        }
        
        const data = JSON.stringify(dataObj)
    
        console.log(dataObj, data)
        const userUpdate = await updateProfile(user, data)
        if (await userUpdate.success) {
            window.location=`/users/show/${user.user_id}`
        }
    }

    function handleChange(e) {
        if (e.target.nextSibling.attributes[1].value >= e.target.value.length) {
          e.target.nextSibling.textContent = e.target.nextSibling.attributes[1].value - e.target.value.length
        }
      }
  

    return (
        <div className="container mt-4">
          <h3 className="mb-4">Edit Your Profile</h3>
          <p>{error}</p>
          <form className="border rounded bg-light px-5 py-4" onSubmit={handleSubmit}>
            <div className="form-group">
              <label >Username</label>
              <input className="form-control form-control-lg" type="text" id="username" minLength="3" maxLength="64" placeholder="eg. DizzyDyer2 (must be unique)" onChange={handleChange} />
              <small className="text-secondary" value='64'>Max 64 characters</small>
            </div>    
            <div className="row">
              <div className="form-group col">
                <label>First Name</label>
                <input className="form-control" type="text" id="first_name" minLength="3" maxLength="35" placeholder="eg. Wayne" />
              </div>  
              <div className="form-group col">
                <label>Last Name</label>
                <input className="form-control" type="text" id="last_name" minLength="1" maxLength="35" placeholder="eg. Dyer" />
              </div>  
            </div>
            <div className="form-group col-4">
                <label>Phone</label>
                <input className="form-control" type="tel" name="phone" id="addPhone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
            </div>  
            <div className="form-group">
              <label >Personal Bio/Description</label>
              <textarea className="form-control" rows="5" id="bio" minLength="5" maxLength="2000" placeholder="Add a paragraph or two about yourself." onChange={handleChange} />
              <small className="text-secondary" value='2000'>Max 2000 characters</small>
            </div>
            <button className="btn bg-dark text-light">Submit</button>
          </form>
        </div>
    )
}