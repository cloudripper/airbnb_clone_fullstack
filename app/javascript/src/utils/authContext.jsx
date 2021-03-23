import React, { useState, useLayoutEffect } from 'react';
import { authenticate, Spinner } from '@utils/tools';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';




export const AuthContext = React.createContext();

export const AuthProvider = (props) => {
    const [ user, setUser ] = useState(null)
    const [ isPending, setIsPending ] = useState(false)
    const [ loaded, setLoaded ] = useState(false)
    const [ errorMsg, setErrorMsg ] = useState(false)

    useLayoutEffect(() => {
        handleLogin()
    }, [])
    
    async function handleLogin() {
        const auth = await authenticate()
        if (!auth) {
            setErrorMsg("Oops. Error loading page.")  
            return
        } else if (await auth.authenticated) {
            //console.log("auth success ", auth)
            setUser(auth)
            setLoaded(true)
        } else {
            console.log("Failed to authenticate")
            setUser("noAuth")
        }
        setIsPending(await false)
      }
    
    if (isPending) {
        return <Spinner error={errorMsg} />
    } else {
        return <AuthContext.Provider value={user} {...props} />
    }
}


export const useAuth= () => {
    const context = React.useContext(AuthContext) 
    if (context === undefined) {
        throw new error('useAuth must be used within an AuthProvider')
    } 
    return context
} 


export function handleLogout(e, props) {
    if (e) { e.preventDefault(); }

    fetch('/api/sessions', safeCredentials({
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }))
      .then(handleErrors)
      .then(data => {
        console.log(data);
        if (data.success) {
        window.location = '/';
        console.log("Logout complete");
        }
      })
      .catch(error => {
        console.log("error: Something went wrong. ", error)
    })
  }