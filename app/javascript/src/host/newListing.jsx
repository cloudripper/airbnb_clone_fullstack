import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import { authenticate, Spinner } from '@utils/tools';
import { AuthContext, AuthProvider, useAuth } from '@utils/authContext';
import { AuthenticatedApp } from '@src/authenticatedApp';
import { UnauthenticatedApp } from '@src/unauthenticatedApp';

import '../property/property.scss';


export const NewListing = (props) => {
    const user = useAuth()
    const [ properties, setProperties ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ next_page, setNext_Page ] = useState(null)
    
    
    return (
        <div className="container pt-4">
          New Listing
        </div>
    )

}
