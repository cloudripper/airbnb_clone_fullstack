import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import { authenticate, Spinner } from '@utils/tools';
import { AuthContext, AuthProvider, useAuth } from '@utils/authContext';
import { AuthenticatedApp } from '@src/authenticatedApp';
import { UnauthenticatedApp } from '@src/unauthenticatedApp';
import { Link, Redirect } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../property/property.scss';

export const Listings = (props) => {
    const user = useAuth()
    const [ properties, setProperties ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(true)
    const [ next_page, setNext_Page ] = useState(null)
    
    useEffect(() => {
        fetchHostProperties()
    }, [])
    

    function fetchHostProperties() {
        const data = null
    }
    
    
    return (
        <div className="container pt-4">
          <h4 className="mb-4">Your Listings</h4>
            <div className="row">
                <div className="col-6 col-lg-4 mb-4">
                      <Link to={`/hosting/${user.user_id}/new-listing'`} className="text-body text-decoration-none">
                        <div className="d-flex text-center hostProperty border rounded justify-content-center align-items-center">
                            <div className="flex-item">
                                <p className="mb-2 text-secondary">ADD LISTING</p>
                                <FontAwesomeIcon id="plusIcon" className="text-secondary" icon={faPlus} />
                            </div>
                        </div>
                      </Link>
                </div>
          </div>
          {loading && <Spinner error={error} />}
          {(loading || next_page === null) ||
          <div className="text-center">
            <button
              className="btn btn-light mb-4"
              
            >load more</button>
          </div>
          }
        </div>
    )

}
///have properties list similarly to Home component///
//
//{properties && properties.map(property => {
//    return (
//      <div key={property.id} className="col-6 col-lg-4 mb-4 property">
//        <a href={`/property/${property.id}`} className="text-body text-decoration-none">
//          <div className="property-image mb-1 rounded" style={{ backgroundImage: `url(${property.image_url})` }} />
//          <p className="text-uppercase mb-0 text-secondary"><small><b>{property.city}</b></small></p>
//          <h6 className="mb-0">{property.title}</h6>
//          <p className="mb-0"><small>${property.price_per_night} USD/night</small></p>
//        </a>
//      </div>
//    )
//})}