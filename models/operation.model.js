const mongoose = require('mongoose');

module.exports.operationSchema = mongoose.Schema({
	fcode: String,
	fnum: String,
	origin: String,
	destination: String,
	aircraft: String,
	depTime: String,
	arrTime: String,
	classes: [String]
});
