const request = require('request-promise');
const airlines = ["BAW", "AAL", "SWA", "DAL", "AFR", "QFA", "VIR", "SQC"];
const count: number = parseInt(process.argv[2]) || 2

if (count as number % 2 != 0) {
	console.log('Number of flights to be generated must be even to split across round trip flights generated.');
	process.exit(1);
}

const airline = airlines[Math.floor(Math.random() * airlines.length)];

(async() => {
	const html: string = await request(`https://www.random.org/clock-times/?num=${count}&earliest=00%3A00&latest=23%3A59&interval=5&format=plain&rnd=new`, {}, (err, res, body) => {
		if (err) { console.log('API error:' + err) }
		else {
			return body;
		}
	})
	const times: string[] = html.split('\n').filter(e => e != "" );
	console.log(times);
})();

