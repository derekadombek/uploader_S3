import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <Auth0Provider
    domain='derekdombek.us.auth0.com'
    clientId='U00HWtRJSQEf7HOqxAXdWsaMF3uStYUr'
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
)
registerServiceWorker()
