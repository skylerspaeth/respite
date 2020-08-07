export {};
const
	// Database
	mongoose = require('mongoose'),
	dbName: string = "respiteDB",
	dbUrl: string = `mongodb://localhost:27017/${dbName}`,
	{ operationSchema } = require('../models/operation.model.js'),
	Operation = mongoose.model("Operation", operationSchema),
	chalk = require('chalk')
;

(async() => {
	await mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
		if (!err) { console.log(`connected to mongoDB @ ${dbUrl}`) }
		else { console.log('DB error: ' + err) }
	});
	async function getDestsByICAO(options) {
		// ... return flight objects that make a connected route

		let docs = await Operation.find({ origin: options.origin }, (err, docs) => docs ).lean();
		if (docs.length != 0) {
			return docs;
		} else { return false; }
	}

	async function generateConnections(origin, destination) {
		let originServices = await Operation.find({ origin: origin }, (err, docs) => docs );
		if (originServices.length != 0) {
			for (let i=0; i<originServices.length; i++) {
				let sroFlights = await getDestsByICAO({ origin: originServices[i]["destination"] });
				sroFlights.forEach((e) => {
					console.log(`${e.origin} -> ${e.destination}`);
					// note to self: when recursing through airports, ignore origin airport
				});
				//console.log("sro:" + sroFlights.origin + "to " + sroFlights.destination));
				let connectingFlights = sroFlights.filter((e) => {
					return e.destination == destination;
				});
				// console.log(connectingFlights.length);
				// let sroFlights = await Operation.find({ origin: originServices[i]["destination"] }, (err, docs) => docs);
				console.dir(connectingFlights);
			}
			/*
			originServices.forEach(async(e) => {
				let sroFlights = await Operation.find({ origin: e.destination }, (err, docs) => docs);
				console.dir(sroFlights);
				// get airports serviced by this destination
			});
			 */
				return true;
			} else { return false; }
	}

	async function routeHasNonstop(origin, destination) {
		let docs = await Operation.find({ origin: origin, destination: destination }, (err, docs) => docs );
		if (docs.length != 0) {
			return docs;
		}
		else { return false; }
	}
	//getItinerariesByICAO('yeet');
	const nonstops = await routeHasNonstop('KAUS','KORD');
	if (nonstops) { console.log(chalk.green(nonstops.length > 1 ? 'Nonstops exist: ' : 'Nonstop exists: '), nonstops) } else { console.log(chalk.yellow('No nonstops exists.')) }

	const connections = await generateConnections('KAUS', 'KORD');
	// if (connections) { console.log(connections) }
	console.log(connections);

	process.exit();
})();
