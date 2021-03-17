import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import { authenticate, Spinner, createListing, updateListingImg } from '@utils/tools';
import { AuthContext, AuthProvider, useAuth } from '@utils/authContext';
import { AuthenticatedApp } from '@src/authenticatedApp';
import { UnauthenticatedApp } from '@src/unauthenticatedApp';

import '../property/property.scss';

const ListingManagement = (props) => {
    const user = useAuth()
    const [ properties, setProperties ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ next_page, setNext_Page ] = useState(null)
    const [ error, setError ] = useState(null)
    const [ uploading, setUploading ] = useState(false)
    



    return (
        <>
          <div className="property-image mb-3" style={{ backgroundImage: `url(${this.state.image})` }}>
            {(() => { 
              let imageSrc = ''
              if (property.image.array) {
                imageSrc = property.image.array[0].image
              } else {
                imageSrc = property.image.seed
              }
              return <img className="propImage" onLoad={()=> $(".propImage").addClass("img-visible") } src={imageSrc} />
            })()} 
          </div>
            <div className="container">
              <div className="row">
                <div className="info col-12 col-lg-8">
                  <div className="mb-3">
                    <h3 className="mb-0">{title}</h3>
                    <p className="text-uppercase mb-0 text-secondary"><small>{city}</small></p>
                    <p className="mb-0"><small>Hosted by <b><Link to={`/users/show/${user.id}`}>{user.username}</Link></b></small></p>
                  </div>
                  <div>
                    <p className="mb-0 text-capitalize"><b>{property_type}</b></p>
                    <p>
                      <span className="mr-3">{max_guests} guests</span>
                      <span className="mr-3">{bedrooms} bedroom</span>
                      <span className="mr-3">{beds} bed</span>
                      <span className="mr-3">{baths} bath</span>
                    </p>
                  </div>
                  <hr />
                  <p>{description}</p>
                </div>
                <br/>
                <div className="col-12 col-lg-5">
                  <p>Property Listings</p>
                </div>
              </div>
          </div>
        </>
      )
}

const EditListing = (props) => {
    return <p>Pending</p>
}