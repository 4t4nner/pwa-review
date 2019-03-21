import {getAuth} from './app'
import fetchApi from "./fetchApi"
import {setApp, setStock} from "./db/stock"

export const initFetchApi = (authStr,method,params, data) => {
    if ((typeof authStr === 'function' && !(authStr = authStr().app.authStr)) || !authStr) {
        throw new Error('!authStr')
    }
    if (typeof params !== 'object') {
        throw new TypeError('type mismatch')
    } else if(params === null || !params){
        console.warn('fetchApi: params === null || !params',params)
        params = {}
    }

    return (new fetchApi(
        method,
        data
    ))
        .setParams(params)
        .setAuth(authStr)
}

function Action(dispatch, getState) {
    let _this = this
    _this.authStr = getState().app.authStr;
    if (typeof getState === 'undefined' || typeof dispatch === 'undefined') {
        throw new Error('no getState')
    }

    this.type = 'default'
    this.json = false
    this.fetchFunc = 'default'

    this.fetchApi = (params = {}, data = {}) => {
        console.log(params,data);
        let api = (new fetchApi(
          this.fetchFunc,
          data
        ))
          .setParams(params)
          .setAuth(this.authStr)

        if (this.json) {
            api.setJson(this.json)
        }

        return api.callApi()
          .then(_this.onAfterFetch)
    }


    this.isSuccess = (json) => (
        !!json
        && (json.success !== undefined ? json.success : true)
    )

    this.onAfterFetch = (json,...params) => {
        const success = this.isSuccess(json);
        const type = `${_this.type}_${success ? 'SUCCESS' : 'FAILED'}`;
        console.log('onAfterFetch', json, type);

        if(this.type && this.type !== 'default'){
            dispatch(Object.assign(
              {},
              json && json.result ? json.result : {},
              {type},
              ...params
            ))
        }

        return {
            json,
            success
        }
    }

    this.setAuthStr = (user = false, password = false) => {
        _this.authStr = getAuth(user, password)
        return _this
    }
}

export const Auth = function (dispatch, getState) {
    Action.call(this, dispatch, getState)

    this.type = 'AUTH'
    this.fetchFunc = 'authorize'

    this.isSuccess = (json) => !!json
        && json.success
        && json.result.authorized

    let parentOnAfterFetch = this.onAfterFetch
    this.onAfterFetch = (json) => {
        console.log(this);
        setApp({
            user: json.result.user,
            authStr: this.authStr,
            authorized: true
        })
        parentOnAfterFetch(json,{authStr: this.authStr})
    }
}

export function UpdateStock(dispatch, getState) {
    Action.call(this, dispatch, getState)

    this.type = 'STOCK_GET_DATA'
    this.fetchFunc = 'getStock'

    const check = (json, name) => {
        try {
            return json
                && name in json
                && typeof json[Object.keys(json)[0]] === 'object'
        } catch (e) {
            console.log(e)
            return false
        }
    }

    this.isSuccess = (json) => !!json
        && json.success
        && (

            check(json.result, 'order')
            || check(json.result, 'checkin')
            // ||  check(json.result,'point')
            // ||  check(json.result,'run')
            // ||  check(json.result,'runStage')
        )


    this.onAfterFetch = async (json) => {
        try {
            return this.isSuccess(json)
                ? (await setStock(json.result) || true)
                : false

        } catch (e) {
            return false
        }
    }
}

export function UploadPhoto(dispatch, getState) {
    Action.call(this, dispatch, getState)

    this.type = 'UPLOAD_PHOTO'
    this.fetchFunc = 'uploadPhoto'
}
export function DeletePhoto(dispatch, getState) {
    Action.call(this, dispatch, getState)

    this.type = 'DELETE_PHOTO'
    this.fetchFunc = 'deletePhoto'
}
export function CancelEditCheckin(dispatch, getState) {
    Action.call(this, dispatch, getState)

    this.type = 'CANCEL_EDIT_CHECKIN'
    this.fetchFunc = 'cancelEditCheckin'
}
export function CommitCheckin(dispatch, getState) {
    Action.call(this, dispatch, getState)

    this.type = 'COMMIT_CHECKIN'
    this.fetchFunc = 'commitCheckin'
}

export async function updateSubOnServer (dispatch, getState) {
    if (!getState().app.authStr) {
        console.log('updateSubOnServer: !authStr')
        return
    }
    const sKey = getState().app.subKey,
      reg = await navigator.serviceWorker.getRegistration(),
      sub = !reg ? false : await reg.pushManager.getSubscription(),
      ep = sub ? sub.endpoint : false

    const UpdateSubscription = function () {
        Action.call(this, dispatch, getState)

        this.type = false
        this.json = sub
        this.fetchFunc = 'updateSubscription'

        this.isSuccess = (json) => (
          !!json
          && (json.success !== undefined ? json.success : true)
          && !!json.result
          && json.result.success
        )
    }

    if (ep !== sKey) {
        (new UpdateSubscription(dispatch, getState))
          .fetchApi()
          .then(({success}) => {
              if(success){
                  dispatch({
                      type: 'UPDATE_SUB_KEY',
                      subKey: ep
                  })
              }
          })
    }
}
