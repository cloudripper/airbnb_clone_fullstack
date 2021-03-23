import React, { useState, useEffect } from 'react';
import { handleErrors } from '@utils/fetchHelper';
import { Spinner, updateListing, MiniSpinner, updateListingImg } from '@utils/tools';
import { useAuth } from '@utils/authContext';
import { Link, Redirect } from 'react-router-dom';
import { BookingTable } from '../utils/bookingTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCamera } from '@fortawesome/free-solid-svg-icons'

import '../property/property.scss';

export const ListingManagement = (props) => {
    const { match: { params }} = props
    const user = useAuth()
    const [ property, setProperty ] = useState(null)
    const [ bookings, setBookings ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ image, setImage ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ upload, setUpload ] = useState(null)
    const [ focus, setFocus ] = useState(null)
    const [ viewDisplay, setViewDisplay ] = useState("Host")

    
    useEffect(() => {
        console.log("Host Property")
        handleLoad()
             
    }, [])

    
    async function handleLoad() {
      const propObj = await fetchProp()
      const bookingObj = await fetchBookings()
      if (await propObj && await bookingObj) { 
        console.log(bookings)
        setLoading(await false) 
      } else {
        setError("Error with data fetch")
      }
    }

    async function fetchProp() {
      const propObj = await fetch(`/api/properties/${params.propId}`)
        .then(handleErrors)
        .then(data => {
            return data.property
        }).catch(error => {
          return false
        })
      
      setProperty(await propObj)
      setImage(await propObj.image.array[1].image)
      return (await propObj) ? true : false
    }

    async function fetchBookings() {
      const bookingObj = await fetch(`/api/host/property/${params.propId}/bookings/`)
      .then(handleErrors)
      .then(data => {
        return data.bookings
      }).catch(error => {
        return false
      })
      console.log(bookingObj)
      setBookings(await bookingObj)
      return (await bookingObj) ? true : false
    }

    async function handleImgSubmit(e) {
      e.preventDefault()
      if (e.target[0].files[0]) {
        const imageFile = e.target[0].files[0]
          if (imageFile.size > 2000000) {
              return setError(<small><i>Image file size too large. Please choose an image with a max file size of 2.0MB.</i></small>)
          } 
          setUpload(<MiniSpinner/>)
          const formData = new FormData()
          formData.append('property[images]', imageFile, imageFile.name)
          
          const listingUpdate = await updateListingImg(property.id, formData)
          
          if (await listingUpdate) {
              window.location=`/property/${property.id}`
          } else {
            console.log("Error: ", listing)
            setError(String(listing))
            setUploading(false)
          }
      }
    }

    function handleEdit(e) {
        e.preventDefault()

        const target = e.currentTarget.parentElement
        if (focus && (focus.parentElement != target.parentElement)) {
          $(focus.previousSibling.firstChild).addClass("focus-warning")
        } else {
          
          if (target.previousSibling.classList.contains("edit")) {
            setFocus(target)
            const input = target.previousSibling
            const title = target.previousSibling.previousSibling
            const btn = target
            $(btn).addClass("d-none")
            $(title).addClass("d-none")
            $(input).removeClass("d-none")
          }  else {
            const title = target.previousSibling
            const input = target
            const btn = target.nextSibling
            $(btn).removeClass("d-none")
            $(title).removeClass("d-none")
            $(input).addClass("d-none")
            setFocus(null)
          }
        }
      
    }


    async function handleSubmit(e) {
      e.preventDefault()
      const form = e.currentTarget
      let data = {}
      if (e.currentTarget.id == "guests") {
        data = {
          max_guests: form[0].value,
          bedrooms: form[1].value,
          beds: form[2].value,
          baths: form[3].value,
        }
      } else {
        data[form.id] = form[0].value
      }
      console.log(JSON.stringify(data))
      const update = await updateListing(property.id, JSON.stringify(data))
      if (await update) {
        return window.location = `/hosting/${user.user_id}/property/${property.id}`
      } else {
        return console.log(update)
      }
    }

    if (loading) {
        return <Spinner error={error} />
    } else if (property.user.id == user.user_id ) {
      return (
            <>
              
              <div className="property-image mb-3" style={{ backgroundImage: `url(${image})` }}>
                {(() => { 
                  let imageSrc = property.image.array[0].image
                  return <img className="propImage" onLoad={()=> $(".propImage").addClass("img-visible") } src={imageSrc} />
                })()} 
                <div className="d-flex justify-content-end mb-2 mb-md-0">
                  <span></span>
                  <form className="flex-item mt-0 mt-lg-3 mr-2 mr-md-3 mr-lg-5 title-edit edit input-group input-group-sm d-none pb-2" id="imgForm" onSubmit={handleImgSubmit}>
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="basic-addon1"><b>IMAGE</b><br/><small> (Max 2MB)</small></span>
                    </div>
                    <input className="form-control" type="file" id="profilePhoto" accept="image/*" />
                    <button className="input-group-append btn btn-sm btn-success ml-1" type="submit">Edit</button>
                    <button className="input-group-append btn btn-sm btn-secondary ml-1" type="button" onClick={handleEdit}>Cancel</button>
                    <span>{upload}{error}</span>
                  </form>
                  <span className="flex-item mt-0 mt-md-3 mr-2 mr-md-3 mr-lg-5"><button className="btn btn-sm" onClick={handleEdit}><FontAwesomeIcon className="imgEditIcon" icon={faCamera} /></button></span>
                </div>
              </div>
                <div className="container">
                  <div className="row">
                    <div className="info col-12 col-lg-8 mt-3">
                      <div className="mb-3">
                          <h3 className="mb-0">
                            <span>{property.title}</span>
                            <form className="title-edit edit input-group input-group-sm d-none pb-2" id="title" onSubmit={handleSubmit}>
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><b>LISTING TITLE</b></span>
                              </div>
                              <input className="form-control" type="text" id="addTitle" maxLength="70" placeholder={`eg. ${property.title}`}  required />
                              <button className="input-group-append btn btn-sm btn-success ml-1" type="submit">Edit</button>
                              <button className="input-group-append btn btn-sm btn-secondary ml-1" type="button" onClick={handleEdit}>Cancel</button>
                            </form>
                            <span className="ml-2"><button className="btn btn-sm editBtn" onClick={handleEdit}><FontAwesomeIcon className="editIcon" icon={faPencilAlt} /></button></span>
                          </h3>
                        <div className="d-flex flex-row">
                          <div className="text-uppercase mb-0 text-secondary">
                            <span><small>{property.city}</small></span>
                            <form className="title-edit edit input-group input-group-sm d-none"  id="city" onSubmit={handleSubmit}>
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><b>CITY</b></span>
                              </div>
                              <input className="form-control" type="text" id="addCity" maxLength="200" placeholder={`eg. ${property.city}`} required />
                              <button className="input-group-append btn btn-sm btn-success ml-1" type="submit">Edit</button>
                              <button className="input-group-append btn btn-sm btn-secondary ml-1 mr-2" type="button" onClick={handleEdit}>Cancel</button>
                            </form>
                            <span className="ml-2"><button className="btn btn-sm editBtn" onClick={handleEdit}><FontAwesomeIcon  className="editIcon" icon={faPencilAlt} /></button></span>
                          </div>
                          -
                          <div className="text-uppercase mb-0 text-secondary ml-2">
                            <span><small>{property.country}</small></span>
                            <form className="title-edit edit input-group input-group-sm d-none"  id="country" onSubmit={handleSubmit}>
                              <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"><b>COUNTRY</b></span>
                              </div>
                              <input className="form-control" type="text" id="addCountry" maxLength="200" placeholder={`eg. ${property.country}`} required />
                              <button className="input-group-append btn btn-sm btn-success ml-1" type="submit">Edit</button>
                              <button className="input-group-append btn btn-sm btn-secondary ml-1" type="button" onClick={handleEdit}>Cancel</button>
                            </form>
                            <span className="ml-2"><button className="btn btn-sm editBtn" onClick={handleEdit}><FontAwesomeIcon  className="editIcon" icon={faPencilAlt} /></button></span>
                          </div>
                        </div>
                        <p className="mb-0"><small>Hosted by <b><Link to={`/users/show/${user.user_id}`}>{user.username}</Link></b></small></p>
                      </div>
                      <div>
                        <div className="mb-0 text-capitalize">
                          <span><b>{property.property_type}</b></span>
                          <form className="title-edit edit input-group input-group-sm d-none" id="property_type" onSubmit={handleSubmit}>
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="basic-addon1"><b>PROPERTY TYPE</b></span>
                            </div>
                            <select className="form-control w-50" type="text" id="addPropType" placeholder="" required >
                              <option>Apartment</option>
                              <option>House</option>
                              <option>Secondary Unit</option>
                              <option>Unique Space</option>
                              <option>Bed and Breakfast</option>
                              <option>Boutique Hotel</option>
                            </select>
                            <button className="input-group-append btn btn-sm btn-success ml-1" type="submit">Edit</button>
                            <button className="input-group-append btn btn-sm btn-secondary ml-1" type="button" onClick={handleEdit}>Cancel</button>
                          </form>
                          <span className="ml-2"><button className="btn btn-sm editBtn" onClick={handleEdit}><FontAwesomeIcon  className="editIcon" icon={faPencilAlt} /></button></span>
                        </div>
                        <div>
                          <span>
                            <span className="mr-3">{property.max_guests} guests</span>
                            <span className="mr-3">{property.bedrooms} bedroom</span>
                            <span className="mr-3">{property.beds} bed</span>
                            <span >{property.baths} bath</span>
                          </span>
                         
                            <form  className="title-edit edit input-group input-group-sm d-none" id="guests" onSubmit={handleSubmit}>
                              <div className="input-group-prepend">
                                <span className="input-group-text input-group-text-sm" id="inputGroup-sizing-sm"><b>PROPERTY TYPE</b></span>
                              </div>
                              <div className="row groupInput">
                                <div className="form-group col">
                                  <label><small>Max # of Guests</small></label>
                                  <input className="form-control form-control-sm" type="number" min="0" max="19" id="addGuest" placeholder="" required />
                                </div>  
                                <div className="form-group col">
                                  <label><small># of Bedrooms</small></label>
                                  <input className="form-control form-control-sm" type="number" min="0" max="19" id="addBedrooms" placeholder=""  required />
                                </div>  
                                <div className="form-group col">
                                  <label><small># of Beds</small></label>
                                  <input className="form-control form-control-sm" type="number" min="0" max="19" id="addBeds" placeholder="" required />
                                </div>  
                                <div className="form-group col">
                                  <label><small># of Bathrooms</small></label>
                                  <input className="form-control form-control-sm" type="number" min="0" max="19" id="addBaths" placeholder=""  required />
                                </div>  
                              </div>
                              <button className="input-group-append btn btn-sm btn-success ml-1" type="submit">Edit</button>
                              <button className="input-group-append btn btn-sm btn-secondary ml-1" type="button" onClick={handleEdit}>Cancel</button>
                            </form>
                        
                          <span className="ml-2"><button className="btn btn-sm editBtn" onClick={handleEdit}><FontAwesomeIcon  className="editIcon" icon={faPencilAlt} /></button></span>
                        </div>
                        <div className="mt-2">
                          <span>
                            <b>${property.price_per_night} per night</b>
                          </span>
                          <form className="title-edit edit input-group input-group-sm d-none" id="price_per_night" onSubmit={handleSubmit}>
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="basic-addon1"><b>PRICE PER NIGHT</b></span>
                            </div>
                            <input className="form-control" type="number" min="0" max="99999" id="addPrice" placeholder="" required />
                            <button className="input-group-append btn btn-sm btn-success ml-1" type="submit">Edit</button>
                            <button className="input-group-append btn btn-sm btn-secondary ml-1" type="button" onClick={handleEdit}>Cancel</button>
                          </form>
                          <span className="ml-2"><button className="btn btn-sm editBtn" onClick={handleEdit}><FontAwesomeIcon  className="editIcon" icon={faPencilAlt} /></button></span>
                        </div>
                      </div>
                      <hr />
                      <div>
                        <span>{property.description}</span>
                        <form className="title-edit edit d-none pb-2"  id="description" onSubmit={handleSubmit}>
                          <span className="input-group-text" ><b>LISTING DESCRIPTIONS</b></span>
                          <textarea className="form-control my-2" rows="5" id="addDesc" minLength="25" maxLength="2000" placeholder={`eg. ${property.description.substring(0,25) + "..."}`} required />
                          <button className="btn btn-sm btn-success ml-1" type="submit">Edit</button>
                          <button className="btn btn-sm btn-secondary ml-1" type="button" onClick={handleEdit}>Cancel</button>
                        </form>
                        <span className="ml-2"><button className="btn btn-sm editBtn" onClick={handleEdit}><FontAwesomeIcon  className="editIcon" icon={faPencilAlt} /></button></span>
                      </div>
                      
                    </div>
                    <BookingTable key={bookings} passBookings={bookings} display={viewDisplay} handleBookings={fetchBookings} />
                  </div>
              </div>
            </>
          )
      } else {
        console.log("Not Host of Listing")
        return <Redirect to={`/property/${property.id}`} />
    }
}
