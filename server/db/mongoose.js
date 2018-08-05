var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_ORANGE_URI || 'mongodb://localhost:27017/ChatApp', { useNewUrlParser: true });
console.log(process.env.MONGOLAB_ORANGE_URI);

module.exports = {
  mongoose: mongoose
};
