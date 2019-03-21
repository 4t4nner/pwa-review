// import {getAuth} from '../services';

let initialState = {
  loaded: false,
  user: false,
  userRole: false,
  authorized: false,
  authStr: false,
  online: true,

  infoModalError : false,
  infoModalOpen : false,
  infoModalMessage : '',

  push: false,
  pushToken: '',
  isUserSubscribed: false,
  subKey: 'default', // subscription endpoint on server - default - random string
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SUB_KEY':{
      console.log(action.type)
      return Object.assign({},state,{
        subKey: action.subKey,
        isUserSubscribed: !!action.subKey
      })
    }
    case 'USER_GOTTEN':{
      console.log(action.type)
      return Object.assign(
          {},
          state,
          {
            user: action.user,
            authorized: true,
          }
      )
    }
    case 'AUTH_FAILED':{
      console.log(action.type)
      return Object.assign({}, state, {
        authorized: false,
        user: false,
      })
    }
    case 'AUTH_SUCCESS': {
      console.log(action.type)
      return Object.assign({}, state, {
        authStr: action.authStr,
        user: action.user,
        authorized: true,
      })
    }
    case 'LOAD_SUCCESS': {
      console.log(action.type)
      return Object.assign({}, state, {
        loaded: true,
      })
    }
    case 'LOAD_FAILED': {
      console.log(action.type)
      return Object.assign({}, state, {
        loaded: false,
      })
    }
    case 'COMMIT_CHECKIN_FAILED':{
      console.log(action.type,action);
      return Object.assign({},state,
          {
            infoModalError : true,
            infoModalOpen : true,
            infoModalMessage : `Чекин НЕ подтвержден! ${action.reason}`,
          })
    }
    case 'COMMIT_CHECKIN_SUCCESS':{
      console.log(action.type,action);
      return Object.assign({},state,
          {
            infoModalOpen : true,
            infoModalMessage : 'Чекин подтвержден',
          })
    }
    case 'INFO_MODAL_CLOSE':{
      console.log(action.type,action);
      return Object.assign({},state,
          {
            infoModalOpen : false,
            infoModalMessage : '',
          })
    }
    case 'INIT_PUSH_SUCCESS':{
      console.log(action.type,action);
      return Object.assign({},state,
          {
            push : true,
            pushToken : action.token,
          })
    }
    case 'INIT_PUSH_FAILED':{
      console.log(action.type,action);
      return Object.assign({},state,
          {
            push : true,
            pushToken : false,
          })
    }
    default:
      return state
  }
}

export default appReducer
