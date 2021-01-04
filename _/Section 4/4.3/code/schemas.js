var mongoose = require('koa-mongoose');

var UserSchema = mongoose.Schema({
   name: String,
   age: Number,
   nationality: String
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');

