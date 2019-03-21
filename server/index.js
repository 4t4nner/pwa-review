
const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const push = require('./push')

const jsonParser = bodyParser.json();


app.post('/push', [jsonParser], (req, res) => {

	// res.write(JSON.stringify(req.headers, null, 2))
	// res.write('\n\n')
	//
	// const contentType = req.get('content-type');
	//
	// if (contentType.includes('text/plain')) {
	// 	res.write(req.body)
	// }
	//
	// if (contentType.includes('application/json') ||
	// 	contentType.includes('multipart/form-data')) {
	// 	res.write(JSON.stringify(req.body, null, 2))
	// }



	let test = req.body;
	res.body = {result:push(req.body)}
	console.log(req)
	res.end()

});

// This serves static files from the specified directory
// app.use(express.static(__dirname));

const server = app.listen(7077, () => {

	const host = server.address().address;
	const port = server.address().port;

	console.log('App listening at http://%s:%s', host, port);
});
