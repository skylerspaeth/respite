const request = require('request-promise');
const airlines = ["BAW", "AAL", "SWA", "DAL", "AFR", "QFA", "VIR", "SQC"];
const count: number = parseInt(process.argv[2]) || 2

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

const airline = airlines[Math.floor(Math.random() * airlines.length)];

(async() => {
	let html: string = await request(`https://www.random.org/clock-times/?num=2&earliest=00%3A00&latest=23%3A59&interval=5&format=plain&rnd=new`, (err, res, body) => {
		if (err) { console.log('API error:' + err) }
		else {
			return body;
		}
	});

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
//	const times: string[] = html.split('\n').filter(e => e != "" );
	console.log(newOperation);
})();

