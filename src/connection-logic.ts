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
	getItinerariesByICAO('yeet');
})();

