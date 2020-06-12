const mongoose = require('mongoose');

module.exports.operationSchema = mongoose.Schema({
	fcode: String,
	fnum: Number,
	aircraft: String,
	depTime: Number,
	arrTime: Number,
	classes: [String]
});
