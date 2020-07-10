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
		await Operation.find({}, (err, docs) => { console.log(err ? err : docs) });
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
	process.exit();
})();
