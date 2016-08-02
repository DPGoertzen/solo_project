var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  bookName: {type: String, required: true, index: {unique: true}},
  author: {type: String, required: true},
  publishDate: {type: Number, required: true},
  quote: {type: String, required: true},
  description: {type: String, required: true},
  amazonLink: {type: String, required: true}
});



module.exports = mongoose.model('Book', BookSchema)
