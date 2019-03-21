import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import routes from './routes'


import './assets/scss/index.scss'
require ('./services/extensions')


const App = ({ history }) => (
    <ConnectedRouter history={history}>
      { routes }
    </ConnectedRouter>
)

App.propTypes = {
  history: PropTypes.object,
}

export default App
