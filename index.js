const
	// Database
	dbName = 'respiteDB',
	dbUrl = `mongodb://localhost:27017/${dbName}`,
	mongoose = require('mongoose'),
	schemas = ["Operation"],

	// Webserver
	express = require('express'),
	app = express(),

	// User input
	prompt = require('prompt-sync')(),
	chalk = require('chalk')
;

// Requrie each schema in array 'schemas'
schemas.forEach((e) => {
	let schemaName = e.toLowerCase() + 'Schema';
	global[schemaName] = require(`./models/${e.toLowerCase()}.model.js`)[schemaName];
	global[e] = mongoose.model(e, global[schemaName]);
});

// Connect to mongoDB
await mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
if (!err) { console.log(`connected to mongoDB @ ${dbUrl}`) }
	else { console.log('DB error:' + err) }
});

const origin = prompt(chalk.cyan('Starting airport [KAUS]: ')).toUpperCase() || "KAUS";
const destination = prompt(chalk.cyan('Destination airport [KSFO]: ')).toUpperCase() || "KSFO";
const passclass = prompt(chalk.cyan('Passenger class [Y, b, p, j]: ')).toUpperCase() || "Y";
console.log(chalk.magenta(`From ${origin}; to ${destination}; in ${passclass} class`));

/* Databse test interaction stuff
// Operation.findOne({ fcode: 'BAW' }, (err, doc) => { console.log(err ? err : doc) });
Operation.updateOne({ fnum: "191" }, { aircraft: 'Boeing 777-200' }, (err) => {
	console.log(err ? err : 'successfully changed aircraft type');
})
*/

