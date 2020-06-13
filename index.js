const
	// Database
	dbName = 'respiteDB',
	dbUrl = `mongodb://localhost:27017/${dbName}`,
	mongoose = require('mongoose'),
	schemas = ["Operation"],

	// Webserver
	express = require('express'),
	app = express()
;

// Requrie each schema in array 'schemas'
schemas.forEach((e) => {
	let schemaName = e.toLowerCase() + 'Schema';
	global[schemaName] = require(`./models/${e.toLowerCase()}.model.js`)[schemaName];
	global[e] = mongoose.model(e, global[schemaName]);
});

// Connect to mongoDB
mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
	if (!err) { console.log(`connected to mongoDB @ ${dbUrl}`) }
	else { console.log('DB error:' + err) }
});

// Operation.findOne({ fcode: 'BAW' }, (err, doc) => { console.log(err ? err : doc) });
Operation.updateOne({ fnum: "191" }, { aircraft: 'Boeing 777-200' }, (err) => {
	console.log(err ? err : 'successfully changed aircraft type');
})
