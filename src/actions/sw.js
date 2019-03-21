import { subscribeUser } from '../services/push'
import { updateSubOnServer } from '../services/appActions'

const serviceWorker = require('../services/serviceWorker')

export const init = () => function (dispatch, getState) {
	if (!('Notification' in window)) {
		console.log('This browser does not support notifications!')
		return
	}

	Notification.requestPermission(status => {
		console.log('Notification permission status:', status)
	})

	const setRegistration = async (registration) => {

		try {

			console.log('subscribeUser_res: ',await subscribeUser(registration))
			await updateSubOnServer(dispatch, getState)

		} catch (e) {
			console.log('setRegistration_error: ', e)
		}
	}
	const config = {
		onUpdate: setRegistration,
		onSuccess: setRegistration
	}

	serviceWorker.register(config)
}
