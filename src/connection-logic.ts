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
	async function getItinerariesByICAO(options) {
		// ... return flight objects that make a connected route

		let docs = await Operation.find({ origin: options.origin }, (err, docs) => docs ).lean();
		if (docs.length != 0) {
			return docs;
		} else { return false; }
	}

	async function generateConnections(origin, destination) {
		let servicedFromOrigin = await Operation.find({ origin: origin }, (err, docs) => docs );
		if (servicedFromOrigin.length != 0) {
			for (let i=0; i<servicedFromOrigin.length; i++) {
				let sroFlights = await getItinerariesByICAO({ origin: servicedFromOrigin[i]["destination"] });
				let connectingFlights = sroFlights.filter((e) => {
					return e.destination == destination;
				});
				console.log(connectingFlights.length);
				// let sroFlights = await Operation.find({ origin: servicedFromOrigin[i]["destination"] }, (err, docs) => docs);
				console.dir(connectingFlights);
			}
			/*
			servicedFromOrigin.forEach(async(e) => {
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
