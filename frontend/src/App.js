import React from 'react'
import './index.css'
import { useAuth0 } from '@auth0/auth0-react'
import Gallery from './Components/Gallery'
import Upload from './Components/Upload'

function App () {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout
  } = useAuth0()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Oops... {error.message}</div>
  }

  if (isAuthenticated) {
    return (
      <div>
        Hi, {user.name} !
        <Upload />
        <Gallery />
        <div className="logout-containter">
          <button className="logout" onClick={() => logout({ returnTo: window.location.origin })}>
            Log out
          </button>
        </div>
      </div>
    )
  } else {
    return <div className="login-container"><div className="vertical-center"><button className="login" onClick={loginWithRedirect}>Login</button></div></div>
  }
}

export default App
