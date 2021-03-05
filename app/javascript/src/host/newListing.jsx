import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import { authenticate, Spinner, createListing } from '@utils/tools';
import { AuthContext, AuthProvider, useAuth } from '@utils/authContext';
import { AuthenticatedApp } from '@src/authenticatedApp';
import { UnauthenticatedApp } from '@src/unauthenticatedApp';

import '../property/property.scss';


export const NewListing = (props) => {
    const user = useAuth()
    const [ properties, setProperties ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ next_page, setNext_Page ] = useState(null)
    const [ error, setError ] = useState(null)
    
    
    async function handleSubmit(e) {
      e.preventDefault()  
      const form = e.target
      console.log('e target: ', form)
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
      console.log('data: ', data)
      const listing = await createListing(user.user_id, data)
      if (await listing.property) {
        console.log('success')
        window.location=`/property/${listing.property.id}`
      } else {
        console.log("Error: ", listing)
        setError(String(listing))
      }

    }

    function handleChange(e) {
      if (e.target.nextSibling.attributes[1].value >= e.target.value.length) {
        e.target.nextSibling.textContent = e.target.nextSibling.attributes[1].value - e.target.value.length
      }
    }

    return (
        <div className="container mt-4">
          <h3 className="mb-4">Add a New Listing</h3>
          <p>{error}</p>
          <form className="border rounded bg-light px-5 py-4" onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="addTitle">Listing Title</label>
              <input className="form-control form-control-lg" type="text" id="addTitle" maxLength="70" placeholder="eg. Moutain Meadow Lodge Guest Room" onChange={handleChange} />
              <small className="text-secondary" value='70'>Max 70 characters</small>
            </div>  
            <div className="form-group">
              <label for="addDesc">Description</label>
              <textarea className="form-control" rows="5" id="addDesc" maxLength="2000" placeholder="Add a paragraph or two describing your listing." onChange={handleChange} />
              <small className="text-secondary" value='2000'>Max 2000 characters</small>
            </div>  
            <div className="row">
              <div className="form-group col">
                <label for="addCity">City</label>
                <input className="form-control" type="text" id="addCity" maxLength="200" placeholder="eg. Dyer" />
              </div>  
              <div className="form-group col">
                <label for="addCountry">Country</label>
                <input className="form-control" type="text" id="addCountry" maxLength="200" placeholder="eg. Austria" />
              </div>  
            </div>
            <div className="form-group">
                <label for="addPropType">Property Type</label>
                <select className="form-control w-50" type="text" id="addPropType" placeholder="" >
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
                <label for="addPrice">Price per night</label>
                <input className="form-control" type="number" min="0" max="99999" id="addPrice" placeholder="" />
              </div>  
              <div className="form-group col">
                <label for="addGuest">Max Number of Guests</label>
                <input className="form-control" type="number" min="0" max="19" id="addGuest" placeholder="" />
              </div>  
              <div className="form-group col">
                <label for="addBeds">Number of Bedrooms</label>
                <input className="form-control" type="number" min="0" max="19" id="addBedrooms" placeholder="" />
              </div>  
              <div className="form-group col">
                <label for="addBeds">Number of Beds</label>
                <input className="form-control" type="number" min="0" max="19" id="addBeds" placeholder="" />
              </div>  
              <div className="form-group col">
                <label for="addBaths">Number of Bathrooms</label>
                <input className="form-control" type="number" min="0" max="19" id="addBaths" placeholder="" />
              </div>  
            </div>
            <div className="form-group">
              <label for="addImg">Listing Profile Photo</label>
              <input className="form-control" type="file" id="addImg" placeholder="Listing Profile Photo" />
            </div>  
            <button className="btn bg-dark text-light">Submit</button>
          </form>
        </div>
    )

}
