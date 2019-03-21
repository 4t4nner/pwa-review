import { Auth, updateSubOnServer } from '../services/appActions'

import { getApp } from '../services/db/stock'

export const auth = (login, password) => function (dispatch, getState) {
	try {
		(new Auth(dispatch, getState))
			.setAuthStr(login, password)
			.fetchApi({ login, password })
			.then(async () => {await updateSubOnServer(dispatch, getState)})

	} catch (e) {
		console.log(e)
	}
}

export const exitAuth = () => function (dispatch, getState) {
	dispatch({
		type: 'AUTH_FAILED'
	})
}

export const getAuthIfExists = () => function (dispatch, getState) {
	const appState = getState().app

	if (!appState.user && !appState.authStr) {
		getApp()
			.then((appDbState) => {
				!!appDbState && !!appDbState.authorized && dispatch(
					Object.assign(
						{},
						{
							type: 'AUTH_SUCCESS',
						},
						appDbState
					)
				)
			})
			.then(async () => {await updateSubOnServer(dispatch, getState)})
	}
}

