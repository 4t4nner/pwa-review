import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import appReducer from './app'
import storageReducer from './stock'
import componentsReducer from './components'

const rootReducer = (history) => combineReducers({
  storage: storageReducer,
  app: appReducer,
  components: componentsReducer,
  router: connectRouter(history)
})

export default rootReducer
