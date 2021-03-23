import React, { useState, useEffect } from 'react';
import { Trips } from '@src/guest/trips';
import { Link } from 'react-router-dom';
import { authenticate, fetchBooking, destroyBooking, fetchUser, MiniSpinner, updateProfileImg, updateProfile, Spinner } from '@utils/tools';
import { useAuth, AuthContext } from '@utils/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faAward } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons'
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
    const [ profileComplete, setProfileComplete ] = useState("Incomplete")

    useEffect(() => {
        profileUser()
        console.log(user.image)
    }, [])

     function profileUser() {
        setProfileComplete(confirmationCheck())
        setUsername(user.username)
        setEmail(user.email)
        setPhone((user.phone) ? user.phone : null)
        setBio((user.bio) ? user.bio : null)
        setFirstName((user.first_name) ? user.first_name : user.username)
        setLastName((user.last_name) ? user.last_name : null)
        setImage((user.image[0]) ? user.image[1].image : "https://via.placeholder.com/300x400")
        const dateObj = new Date(user.created_at)
        setCreated(dateObj.getFullYear())
        setLoading(true)
    
        loadImage()
    }

    function confirmationCheck() {
        const itemArray = []
        itemArray.push(user.first_name)
        itemArray.push(user.last_name)
        itemArray.push(user.phone)
        itemArray.push(user.bio)
        itemArray.push(user.image[0].image)
        console.log(itemArray)
        let count = 0 
        for (let i = 0; i < itemArray.length; i++) {
            if (itemArray[i] == null) {
                count++      
            }   
        } 
        if (count > 0) {
            return "Incomplete"
        } else {
            return "Complete"
        }
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
        
        const imageFile = e.target.files[0]
        console.log(imageFile.size)
        if (imageFile.size > 1500000) {
            return setUpload(<small><i>Image file size too large. Please choose an image with a max file size of 1.5MB.</i></small>)
        } 
        setUpload(<MiniSpinner/>)
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
            <div className="container">
                <div className="row mt-5">
                    <div className="col-12 d-block d-md-none">
                    <h3 className="ml-5 mb-3"><b>Your Profile</b></h3>
                    </div>
                    <div className="col-12 col-md-4 mb-md-5 pb-md-5" >
                        <div className="mx-5 mb-3 mb-md-0 mx-md-0 border p-4 styleContainer">
                            <img className="mx-auto d-block img img-fluid mb-4 rounded align-self-center" id="avatarImg" src={`${image}`} />
                            <p>{upload}</p>
                            <div className="dropdown text-center text-md-left">
                                <button className="ml-xl-4 btn btn-sm btn-secondary dropdown-toggle" type="button" id="profileDropDown" data-toggle="dropdown" aria-expanded="false">Update Photo</button>
                                <ul className="dropdown-menu py-3 px-3" aria-labelledby="profileDropDown">
                                    <form onChange={handleSubmit} >
                                        <div className="form-group mb-0 ">
                                            <li className="text-center mb-3 font-weight-bold "><label>Select a profile image to upload <br/><small>(Max File Size: 1.5 MB)</small></label></li>
                                            <li className="text-center mb-3 mx-2"><input className="form-control" type="file" id="profilePhoto" accept="image/*" /></li>
                                            <li className="text-center mb-0"><button className="ml-auto">Submit</button></li>
                                        </div>
                                    </form>
                                </ul>
                            </div>
                            <div className="d-none d-md-block"> 
                                <hr/>
                                <h6 className="my-4"><span className="font-weight-bold text-uppercase">{username}</span>'s Profile is {profileComplete}:</h6>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.email) ? "text-success" : "text-danger"} icon={(user.email) ? faCheckCircle : faTimesCircle} /></span> Email Address</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.first_name) ? "text-success" : "text-danger"} icon={(user.first_name) ? faCheckCircle : faTimesCircle} /></span> First Name</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.last_name) ? "text-success" : "text-danger"} icon={(user.last_name) ? faCheckCircle : faTimesCircle} /></span> Last Name</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.phone) ? "text-success" : "text-danger"} icon={(user.phone) ? faCheckCircle : faTimesCircle} /></span> Phone Number</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.image[0].image) ? "text-success" : "text-danger"} icon={(user.image[0].image) ? faCheckCircle : faTimesCircle} /></span> Profile Photo</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.bio) ? "text-success" : "text-danger"} icon={(user.bio) ? faCheckCircle : faTimesCircle} /></span> Bio/Description</p>
                                <p className="mt-2 font-italic">Confirming profile info helps keep the Airbnb community secure.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="ml-5 mt-3 mt-md-4">
                            <h3 className="font-weight-bold">Hi, I'm {firstName}.</h3>
                            <p className="mb-2">Joined in {created}</p>
                            {(user.host_status) ? <p><FontAwesomeIcon className="mr-2 text-warning" icon={faAward} /><span className="font-italic">{firstName} is a Host!</span></p> : null}
                            <small><Link className="mb-4 linkStyle" to={`/users/edit/${user.user_id}`}>Edit Profile</Link></small>
                            <hr/>
                            <div className="mt-2">
                                <h4 className="font-weight-bold">About</h4>
                                <p>{(()=>{ return (bio) ? bio : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."})()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-block mb-5 pb-3 d-md-none">
                        <div className="mx-3 my-3 border styleContainer p-4">
                            <h6 className="mt-2 mb-4"><span className="font-weight-bold text-uppercase">{username}</span>'s Profile is {profileComplete}:</h6>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.email) ? "text-success" : "text-danger"} icon={(user.email) ? faCheckCircle : faTimesCircle} /></span> Email Address</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.first_name) ? "text-success" : "text-danger"} icon={(user.first_name) ? faCheckCircle : faTimesCircle} /></span> First Name</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.last_name) ? "text-success" : "text-danger"} icon={(user.last_name) ? faCheckCircle : faTimesCircle} /></span> Last Name</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.phone) ? "text-success" : "text-danger"} icon={(user.phone) ? faCheckCircle : faTimesCircle} /></span> Phone Number</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.image[0].image) ? "text-success" : "text-danger"} icon={(user.image[0].image) ? faCheckCircle : faTimesCircle} /></span> Profile Photo</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(user.bio) ? "text-success" : "text-danger"} icon={(user.bio) ? faCheckCircle : faTimesCircle} /></span> Bio/Description</p>
                            <p className="mt-2 font-italic">Confirming profile info helps keep the Airbnb community secure.</p>
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
    const [ profileComplete, setProfileComplete ] = useState("Incomplete")


    useEffect(() => {
        console.log(props.userId)
        profileUser()
    }, [])

    
     async function profileUser() {
        const profUser = await fetchUser(props.userId)
        const profCheck = confirmationCheck(await profUser)
        const dateObj = new Date(await profUser.created_at)
        setVisitUser(await profUser)
        setUsername(await profUser.username)
        setEmail(await profUser.email)
        setCreated(await dateObj.getFullYear())
        setImage(await (profUser.image[0]) ? profUser.image[1].image : null)
        setBio(await (profUser.bio) ? profUser.bio : null)
        setFirstName(await (profUser.first_name) ? profUser.first_name : profUser.username)
        setLastName(await (profUser.last_name) ? profUser.last_name : null)
        setProfileComplete(profCheck)
        setLoading(await false)
        await loadImage(profUser)
    }

    function confirmationCheck(user) {
        const itemArray = []
        itemArray.push(user.first_name)
        itemArray.push(user.last_name)
        itemArray.push(user.phone)
        itemArray.push(user.bio)
        itemArray.push(user.image[0].image)
        console.log(itemArray)
        let count = 0 
        for (let i = 0; i < itemArray.length; i++) {
            if (itemArray[i] == null) {
                count++      
            }   
        } 
        if (count > 0) {
            return "Incomplete"
        } else {
            return "Complete"
        }
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
            <div className="container">
                <div className="row mt-5">
                    <div className="col-12 d-block d-md-none">
                    <h3 className="ml-5 mb-3"><b>User Profile</b></h3>
                    </div>
                    <div className="col-12 col-md-4 mb-md-5 pb-md-5" >
                        <div className="mx-5 mb-3 mb-md-0 mx-md-0 border p-4 styleContainer">
                            {(image) ? <img className="mx-auto d-block img img-fluid mt-3 mt-md-0 mb-md-2 rounded align-self-center" id="avatarImg" src={`${image}`} /> : <FontAwesomeIcon className="mx-auto d-block img img-responsive mb-4 rounded align-self-center" id="avatarProfile" icon={faUser} /> }
                            <p>{upload}</p>
                        
                            <div className="d-none d-md-block"> 
                                <hr/>
                                <h6 className="my-4"><span className="font-weight-bold text-uppercase">{username}</span>'s Profile is {profileComplete}:</h6>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.email) ? "text-success" : "text-danger"} icon={(visitUser.email) ? faCheckCircle : faTimesCircle} /></span> Email Address</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.first_name) ? "text-success" : "text-danger"} icon={(visitUser.first_name) ? faCheckCircle : faTimesCircle} /></span> First Name</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.last_name) ? "text-success" : "text-danger"} icon={(visitUser.last_name) ? faCheckCircle : faTimesCircle} /></span> Last Name</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.phone) ? "text-success" : "text-danger"} icon={(visitUser.phone) ? faCheckCircle : faTimesCircle} /></span> Phone Number</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.image[0].image) ? "text-success" : "text-danger"} icon={(visitUser.image[0].image) ? faCheckCircle : faTimesCircle} /></span> Profile Photo</p>
                                <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.bio) ? "text-success" : "text-danger"} icon={(visitUser.bio) ? faCheckCircle : faTimesCircle} /></span> Bio/Description</p>
                                <p className="mt-2 font-italic">Confirming profile info helps keep the Airbnb community secure.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="ml-5 mt-3 mt-md-4">
                            <h3 className="font-weight-bold">Hi, I'm {firstName}.</h3>
                            <p className="mb-2">Joined in {created}</p>
                            {(visitUser.host_status) ? <p><FontAwesomeIcon className="mr-2 text-warning" icon={faAward} /><span className="font-italic">{firstName} is a Host!</span></p> : null}
                            <hr/>
                            <div className="mt-2">  
                                <h4 className="font-weight-bold">About</h4>
                                <p>{(()=>{ return (bio) ? bio : <i>"No information provided."</i>})()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-block mb-5 pb-3 d-md-none">
                        <div className="mx-3 my-3 border styleContainer p-4">
                            <h6 className="mt-2 mb-4"><span className="font-weight-bold text-uppercase">{username}</span>'s Profile is {profileComplete}:</h6>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.email) ? "text-success" : "text-danger"} icon={(visitUser.email) ? faCheckCircle : faTimesCircle} /></span> Email Address</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.first_name) ? "text-success" : "text-danger"} icon={(visitUser.first_name) ? faCheckCircle : faTimesCircle} /></span> First Name</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.last_name) ? "text-success" : "text-danger"} icon={(visitUser.last_name) ? faCheckCircle : faTimesCircle} /></span> Last Name</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.phone) ? "text-success" : "text-danger"} icon={(visitUser.phone) ? faCheckCircle : faTimesCircle} /></span> Phone Number</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.image[0].image) ? "text-success" : "text-danger"} icon={(visitUser.image[0].image) ? faCheckCircle : faTimesCircle} /></span> Profile Photo</p>
                            <p className="mt-2"><span className="mx-2"><FontAwesomeIcon className={(visitUser.bio) ? "text-success" : "text-danger"} icon={(visitUser.bio) ? faCheckCircle : faTimesCircle} /></span> Bio/Description</p>
                            <p className="mt-2 font-italic">Confirming profile info helps keep the Airbnb community secure.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export const EditProfile = (props) => {
    const user = useAuth()
    const [ error, setError ] = useState(null)

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
          <form className="border bg-light px-5 py-4 styleContainer" onSubmit={handleSubmit}>
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
                <input className="form-control" type="tel" name="phone" id="phone" minLength="8" maxLength="13" />
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