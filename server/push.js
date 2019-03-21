'use strict';

const webPush = require('web-push')

const TTL = 60 * 60 * 4
const vapidDetails = {
	subject: 'mailto: tannerman@inbox.ru',
	publicKey: 'BHGAAy74Go3kV2VP8bkEeyJ_dpq6SKY4Agv6yyXQ_SBBeseogvfV9ttdFWubK1eCc29dl6EyJCQhoh7BGL246NM',
	privateKey: '-iMbcVlWWIpwyuAuNjfMzjY9rsBirgzgYCQQc1-TAJ8'
}

function validate (pushSubscription, payload) {
	return true;
}


function sendNotifications ({pushSubscription, payload}) {

	if(!validate(pushSubscription, payload)){
		return 'fail';
	}
	const options = {
		TTL,
		vapidDetails
	}

	let res = webPush.sendNotification(
		pushSubscription,
		payload,
		options
	);
	return 'success'
}

module.exports = sendNotifications
