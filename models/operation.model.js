const mongoose = require('mongoose');

module.exports.operationSchema = mongoose.Schema({
	fcode: String,
	fnum: Number,
	aircraft: String,
	depTime: String,
	arrTime: String,
	classes: [String]
});
