export {};
interface Route {
	origin: string;
	destination: string;
	passclass?: string;
}
const
	mongoose = require('mongoose'),
	dbName: string = "respiteDB",
	dbUrl: string = `mongodb://localhost:27017/${dbName}`,
	{ operationSchema } = require('../models/operation.model.js'),
	Operation = mongoose.model("Operation", operationSchema),
	prompt = require('prompt-sync')(),
	chalk = require('chalk'),
	routing: Route = { origin: process.argv[2], destination: process.argv[3] }
;

if (!routing.origin || !routing.destination) {
	routing.origin = prompt(chalk.cyan('Starting airport [KAUS]: ')).toUpperCase() || "KAUS";
	routing.destination = prompt(chalk.cyan('Destination airport [KSFO]: ')).toUpperCase() || "KSFO";
	// routing.passclass = prompt(chalk.cyan('Passenger class [Y, b, p, j]: ')).toUpperCase() || "Y";
	routing.passclass = 'any';
	console.log(chalk.magenta(`From ${routing.origin}; to ${routing.destination}; in ${routing.passclass} class`));
}

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
			let connected: boolean = false;
			for (let i=0; i<originServices.length; i++) {
				let sroFlights = await getDestsByICAO({ origin: originServices[i]["destination"] });
				/* // commented out to disable excessively verbose output
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
				if (connectingFlights.length != 0) {
					connected = true;
					connectingFlights.forEach((c) => {
						console.log(`${chalk.green('Connection itinerary found:')} ${originServices[i]["origin"]} -> ${originServices[i]["destination"]}; ${c.origin} -> ${c.destination}`);
						console.log(originServices[i]);
						console.log(c);
					});
				}
			}
			return connected;
		} else { return false; }
	}

	async function routeHasNonstop(origin, destination) {
		let docs = await Operation.find({ origin: origin, destination: destination }, (err, docs) => docs );
		if (docs.length != 0) {
			return docs;
		}
		else { return false; }
	}
	const nonstops = await routeHasNonstop(routing.origin, routing.destination);
	if (nonstops) { console.log(chalk.green(nonstops.length > 1 ? 'Nonstops exist: ' : 'Nonstop exists: '), nonstops) } else { console.log(chalk.yellow('No nonstops exist.')) }

	const connections = await generateConnections(routing.origin, routing.destination);
	if (!connections) { console.log(chalk.yellow('No connecting flights exist.')) }

	process.exit();
})();
