import React, { useState } from 'react';
import { Spinner, createListing, updateListingImg } from '@utils/tools';
import { useAuth } from '@utils/authContext';

import '../property/property.scss';


export const NewListing = (props) => {
    const user = useAuth()
    const [ error, setError ] = useState(null)
    const [ uploading, setUploading ] = useState(false)
    
    
    async function handleSubmit(e) {
      e.preventDefault()
      const form = e.target
      const imageFile = form[10].files[0]  
      if (imageFile.size > 1500000) {
        return setError(<small className="text-danger"><i>Image file size too large. Please choose an image with a max file size of 1.5MB.</i></small>)
      } 
      setUploading(true)
    
      const data = {
        title: form[0].value,
        description: form[1].value,
        city: form[2].value,
        country: form[3].value,
        property_type: form[4].value,
        price_per_night: form[5].value,
        max_guests: form[6].value,
        bedrooms: form[7].value,
        beds: form[8].value,
        baths: form[9].value,
        user: {
          id: user.user_id,
          username: user.username
          } 
      }

      const listing = await createListing(user.user_id, data)
      if (await listing.property) {
        console.log('success')
        
        const formData = new FormData()
        formData.append('property[images]', imageFile, imageFile.name)
              
        const listingUpdate = await updateListingImg(listing.property.id, formData)
        
        if (await listingUpdate) {
            window.location=`/property/${listing.property.id}`
        } else {
          console.log("Error: ", listing)
          setError(String(listing))
          setUploading(false)
        }
      } 
    }

    function handleChange(e) {
      if (e.target.nextSibling.attributes[1].value >= e.target.value.length) {
        e.target.nextSibling.textContent = e.target.nextSibling.attributes[1].value - e.target.value.length
      }
    }

    if (uploading) {
      return <Spinner/>
    } else {
      return (
          <div className="container mt-4">
            <h3 className="mb-4">Add a New Listing</h3>
            <p>{error}</p>
            <form className="border rounded bg-light px-5 py-4" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Listing Title</label>
                <input className="form-control form-control-lg" type="text" id="addTitle" maxLength="70" placeholder="eg. Mountain Meadow Lodge Guest Room" onChange={handleChange} required />
                <small className="text-secondary" value='70'>Max 70 characters</small>
              </div>  
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows="5" id="addDesc" minLength="25" maxLength="2000" placeholder="Add a paragraph or two describing your listing." onChange={handleChange} required />
                <small className="text-secondary" value='2000'>Max 2000 characters</small>
              </div>  
              <div className="row">
                <div className="form-group col">
                  <label>City</label>
                  <input className="form-control" type="text" id="addCity" maxLength="200" placeholder="eg. Dyer" required />
                </div>  
                <div className="form-group col">
                  <label>Country</label>
                  <input className="form-control" type="text" id="addCountry" maxLength="200" placeholder="eg. Austria" required />
                </div>  
              </div>
              <div className="form-group">
                  <label>Property Type</label>
                  <select className="form-control w-50" type="text" id="addPropType" placeholder="" required >
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Secondary Unit</option>
                      <option>Unique Space</option>
                      <option>Bed and Breakfast</option>
                      <option>Boutique Hotel</option>
                  </select>
                </div>  
              <div className="row">
                <div className="form-group col">
                  <label>Price per night</label>
                  <input className="form-control" type="number" min="0" max="99999" id="addPrice" placeholder="" required />
                </div>  
                <div className="form-group col">
                  <label>Max Number of Guests</label>
                  <input className="form-control" type="number" min="0" max="19" id="addGuest" placeholder="" required />
                </div>  
                <div className="form-group col">
                  <label>Number of Bedrooms</label>
                  <input className="form-control" type="number" min="0" max="19" id="addBedrooms" placeholder="" required />
                </div>  
                <div className="form-group col">
                  <label>Number of Beds</label>
                  <input className="form-control" type="number" min="0" max="19" id="addBeds" placeholder="" required />
                </div>  
                <div className="form-group col">
                  <label>Number of Bathrooms</label>
                  <input className="form-control" type="number" min="0" max="19" id="addBaths" placeholder="" required />
                </div>  
              </div>
              <div className="form-group">
                <label>Listing Profile Photo<br/><small className="text-danger">(Max File Size: 1.5 MB)</small></label>
                <input className="form-control" type="file" id="addImg" placeholder="Listing Profile Photo" accept="image/*" required />
              </div>  
              <button className="btn bg-dark text-light">Submit</button>
            </form>
          </div>
      )
    }
} 
