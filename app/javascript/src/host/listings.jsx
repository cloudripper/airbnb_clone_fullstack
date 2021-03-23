import React, { useState, useEffect } from 'react';
import { Spinner, fetchUserProperties } from '@utils/tools';
import { useAuth } from '@utils/authContext';
import { Link, Redirect } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../property/property.scss';

export const Listings = (props) => {
    const user = useAuth()
    const [ properties, setProperties ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(true)
    const [ next_page, setNext_Page ] = useState(null)
    
    useEffect(() => {
        fetchProperties()
    }, [])
    

    async function fetchProperties() {
        const data = await fetchUserProperties(user.user_id)
        await console.log("fetch data: ", data)
        if (await data.length > 0) {
            await setProperties(data)
            await console.log("props: ", properties)
        }
    }
    
    
    return (
        <div className="container vh-100">
          <h4 className="mt-5 ml-5 mr-auto font-weight-bold mb-3">Your Listings</h4>
            <div className="d-flex justify-content-center justify-content-sm-left justify-content-lg-center flex-wrap pb-4 mb-5 ">
                <Link to={`/hosting/${user.user_id}/new-listing`} className="text-decoration-none text-dark flex-item bg-light d-flex flex-column hostProperty styleContainer mx-4 px-2 py-2 mt-3 mt-sm-3 mb-4 my-md-0 text-center justify-content-center align-items-center">
                      <div className="flex-item">
                          <p className="mb-2 text-secondary">ADD LISTING</p>
                          <FontAwesomeIcon id="plusIcon" className="text-secondary" icon={faPlus} />
                      </div>
                </Link>
                {properties.map(property => {
                    return (
                        <Link key={property.id} to={`/hosting/${user.user_id}/property/${property.id}`} className="text-decoration-none text-dark flex-item bg-light d-flex flex-column hostProperty styleContainer mx-4 px-2 py-2 mt-3 mb-4 my-md-0 text-center justify-content-center align-items-center"  >
                                <img className="flex-item" id="hostListing" src={property.image.array[1].image} />
                                <p className="flex-item text-uppercase mb-0 text-secondary"><small><b>{property.city}</b></small></p>
                                <h6 className="flex-item mb-0">{property.title}</h6>
                                <p className="flex-item mb-0"><small>${property.price_per_night} USD/night</small></p>
                        </Link>
                    )
                })}
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
