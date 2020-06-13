const
	// Invocation arguments
	count: number = parseInt(process.argv[2]) || 1,

	// Asynchronous requests
	request = require('request-promise'),

	// Database
	mongoose = require('mongoose'),
	dbName: string = "respiteDB",
	dbUrl: string = `mongodb://localhost:27017/${dbName}`,
	{ operationSchema } = require('../models/operation.model.js'),
	Operation = mongoose.model("Operation", operationSchema)
;

const
	airlines = ["BAW", "AAL", "SWA", "DAL", "AFR", "QFA", "VIR", "SQC"],
	airports = ["KAUS", "KLAX", "KFSO", "KSEA", "KORD", "KDFW", "KIAH", "KJFK", "EGLL", "LFPG", "LTFM"],
	aircraft = ["Boeing 777-200", "Boeing 747-400", "Boeing 787-900", "Boeing 737-8 MAX", "Airbus 321neo", "Airbus 388", "Airbus 350xwb"]
;

mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
	if (!err) { console.log(`connected to mongoDB @ ${dbUrl}`) }
	else { console.log('DB error:' + err) }
});

interface Operation {
	fcode: string;
	fnum: number;
	origin: string;
	destination: string;
	aircraft: string;
	depTime: string;
	arrTime: string;
	classes: string[];
}

/* if (count as number % 2 != 0) {
	console.log('Number of flights to be generated must be even to split across round trip flights generated.');
	process.exit(1);
} */

for(let i: number = 0; i < count; i++) {
	(async() => {
		let html: string = await request(`https://www.random.org/clock-times/?num=${count * 2}&earliest=00%3A00&latest=23%3A59&interval=5&format=plain&rnd=new`,
			(err, res, body) => {
				if (err) { console.log('API error:' + err) }
				else { return body }
			}
		);

		let origin = airports[Math.floor(Math.random() * airports.length)];
		function preventDup(originAirport) {
			let newAirport;
			do { newAirport = Math.floor(Math.random() * airports.length);
			} while (airports[newAirport] === originAirport);
			return airports[newAirport];
		}

		let outgoingFlight: Operation = {
			fcode: airlines[Math.floor(Math.random() * airlines.length)],
			fnum: Math.floor(Math.random() * 1000),
			origin: origin,
			destination: preventDup(origin),
			aircraft: aircraft[Math.floor(Math.random() * aircraft.length)],
			depTime: html.split('\n').filter(e => e != "" )[0],
			arrTime: html.split('\n').filter(e => e != "" )[1],
			classes: ["A", "B", "C"]
		}
		function generateIncoming(from) {
			return new Object({
				fcode: from.fcode,
				fnum: from.fnum += 1,
				origin: from.destination,
				destination: from.origin,
				aircraft: from.aircraft,
				depTime: html.split('\n').filter(e => e != "" )[2],
				arrTime: html.split('\n').filter(e => e != "" )[3],
				classes: from.classes
			});
		}
		await Operation.create(outgoingFlight);
		await Operation.create(generateIncoming(outgoingFlight));
	})();
}
