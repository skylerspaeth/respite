export {};
const
	// Database
	mongoose = require('mongoose'),
	dbName: string = "respiteDB",
	dbUrl: string = `mongodb://localhost:27017/${dbName}`,
	{ operationSchema } = require('../models/operation.model.js'),
	Operation = mongoose.model("Operation", operationSchema)
;

(async() => {
	await mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
		if (!err) { console.log(`connected to mongoDB @ ${dbUrl}`) }
		else { console.log('DB error:' + err) }
	});
	async function getItinerariesByICAO(options) {
		// ... return flight objects that make a connected route
		await Operation.find({}, (err, docs) => { console.log(err ? err : docs) });
	}
	async function routeHasNonstop(origin, destination) {
		let docs = await Operation.find({ origin: origin, destination: destination }, (err, docs) => docs );
		//console.log(docs.length);
		if (docs.length != 0) {
			return docs;
		}
		else { return false; }
	}
	//getItinerariesByICAO('yeet');
	if (await routeHasNonstop('KAUS','EGLL')) { console.log('found result') } else { console.log('no result') }
	//console.log(await routeHasNonstop('KAUS', 'EGLL'));
	//await Operation.find({ origin: "KAUS", destination: "EGLL" }, (err, doc) => { console.log(doc) });
	process.exit();
})();
