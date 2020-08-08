export {};
const
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
		let docs = await Operation.find({ origin: options.origin }, (err, docs) => docs ).lean();
		if (docs.length != 0) {
			return docs;
			// return destination docs serviced by options.origin
		} else { return false; }
	}

	async function generateConnections(origin, destination) {
		let originServices = await Operation.find({ origin: origin }, (err, docs) => docs );
		if (originServices.length != 0) {
			for (let i=0; i<originServices.length; i++) {
				let sroFlights = await getDestsByICAO({ origin: originServices[i]["destination"] });
				/* // commented out to disable verbose output
				console.log(`${originServices[i]["destination"]} has the following routes:`);
				sroFlights.forEach((e) => {
					console.log(`${e.origin} -> ${e.destination}`);
				});
				 */
				// note to self: when recursing through airports, ignore origin airport
				let connectingFlights = sroFlights.filter((e) => {
					if (e.destination == destination) {
						//console.log(`${chalk.green('Connection itinerary found:')} ${originServices[i]["origin"]} -> ${originServices[i]["destination"]}; ${e.origin} -> ${e.destination}:`);
						//console.log(originServices[i]);
						return true;
					}
				});
				// let sroFlights = await Operation.find({ origin: originServices[i]["destination"] }, (err, docs) => docs);
				if (connectingFlights.length != 0) connectingFlights.forEach((c) => {
					console.log(`${chalk.green('Connection itinerary found:')} ${originServices[i]["origin"]} -> ${originServices[i]["destination"]}; ${c.origin} -> ${c.destination}`);
					console.log(originServices[i]);
					console.log(c);
				});
			}
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
	const nonstops = await routeHasNonstop('KAUS','KDFW');
	if (nonstops) { console.log(chalk.green(nonstops.length > 1 ? 'Nonstops exist: ' : 'Nonstop exists: '), nonstops) } else { console.log(chalk.yellow('No nonstops exists.')) }

	const connections = await generateConnections('KAUS', 'KDFW');
	// if (connections) { console.log(connections) }
	console.log(connections);

	process.exit();
})();
