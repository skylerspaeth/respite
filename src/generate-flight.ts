const count: number = parseInt(process.argv[2]) || 2
const request = require('request-promise');
const
	airlines = ["BAW", "AAL", "SWA", "DAL", "AFR", "QFA", "VIR", "SQC"],
	airports = ["KAUS", "KLAX", "KFSO", "KSEA", "KORD", "KDFW", "KIAH", "KJFK", "EGLL", "LFPG", "LTFM"],
	aircraft = ["Boeing 777-200", "Boeing 747-400", "Boeing 787-900", "Boeing 737-8 MAX", "Airbus 321neo", "Airbus 388", "Airbus 350xwb"]
;

interface Operation {
	fcode: string;
	fnum: string;
	origin: string;
	destination: string;
	aircraft: string;
	depTime: string;
	arrTime: string;
	classes: string[];
}

if (count as number % 2 != 0) {
	console.log('Number of flights to be generated must be even to split across round trip flights generated.');
	process.exit(1);
}

(async() => {
	let html: string = await request(`https://www.random.org/clock-times/?num=2&earliest=00%3A00&latest=23%3A59&interval=5&format=plain&rnd=new`,
		(err, res, body) => {
			if (err) { console.log('API error:' + err) }
			else {
				return body;
			}
		}
	);

	let origin = airports[Math.floor(Math.random() * airports.length)];
	console.log('Origin: ' + origin);
	function preventDup(originAirport) {
		let newAirport;
		do { newAirport = Math.floor(Math.random() * airports.length); console.log('trying again');
		} while (airports[newAirport] === originAirport);
		return airports[newAirport];
	}
	/* function preventDup(originAirport) {
		if (originAirport === airports[Math.floor(Math.random() * airports.length)]) {
			console.log(`Origin airport: ${originAirport} is the same as randomly chosen destination of ${_}. Attempting again`);
			preventDup();
		} else {
			console.log(`${originAirport} != ${_}, continuing...`);
		}
	}
	preventDup(origin); */
	console.log('Destination: ' + preventDup(origin));

	let newOperation: Operation = {
		fcode: airlines[Math.floor(Math.random() * airlines.length)],
		fnum: Math.floor(Math.random() * 1000).toString(),
		origin: "KAUS",
		destination: "EGLL",
		aircraft: "Airbus A350",
		depTime: html.split('\n').filter(e => e != "" )[0],
		arrTime: html.split('\n').filter(e => e != "" )[1],
		classes: ["A", "B", "C"]
	}
	console.log(newOperation);
})();

