import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import { authenticate } from '@utils/tools';
import { AuthContext, AuthProvider, useAuth } from '@utils/authContext';
import { AuthenticatedApp } from '@src/authenticatedApp';
import { UnauthenticatedApp } from '@src/unauthenticatedApp';


export const Bookings = (props) => {

    return (
        <div>Bookings</div>
    )

}
///have bookings list similarly to Trips component///