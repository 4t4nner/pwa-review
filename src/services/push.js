const applicationServerPublicKey = 'BHGAAy74Go3kV2VP8bkEeyJ_dpq6SKY4Agv6yyXQ_SBBeseogvfV9ttdFWubK1eCc29dl6EyJCQhoh7BGL246NM'

function urlB64ToUint8Array (base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4)
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/')

	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

export async function getSubscription(){
	const reg = await navigator.serviceWorker.getRegistration();
	if(!reg){
		throw new Error('no service worker!');
	}
	return reg.pushManager.getSubscription()
}


export function subscribeUser () {
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)

	try{
		return navigator.serviceWorker.getRegistration().then((reg) => {
			return reg.pushManager.getSubscription().then((sub) => {
				if(!sub){
					console.log('!sub: ',applicationServerKey,reg);
					return reg.pushManager.subscribe({
						userVisibleOnly: true,
						applicationServerKey: applicationServerKey
					})
						.catch(e => {
							console.log('subscribe_error',e,typeof e)
							console.log('subscribe_error',e,typeof e, Object.keys(e))
						})
				}
				return sub
			}).catch(e => {
				console.log('getSubscription_error',e)
			});
		})

	} catch (e) {
		if (Notification.permission === 'denied') {
			console.warn('Permission for notifications was denied')
		} else {
			console.error('Failed to subscribe the user: ', e)
		}
		return false
	}
}

function displayNotification () {

	if (Notification.permission === 'granted') {
		navigator.serviceWorker.getRegistration().then(reg => {

			const options = {
				body: 'First notification!',
				icon: 'images/notification-flat.png',
				vibrate: [100, 50, 100],
				data: {
					dateOfArrival: Date.now(),
					primaryKey: 1
				},

				actions: [
					{
						action: 'explore', title: 'Go to the site',
						icon: 'images/checkmark.png'
					},
					{
						action: 'close', title: 'Close the notification',
						icon: 'images/xmark.png'
					},
				]

			}

			reg.showNotification('Hello world!', options)
		})
	}

}

