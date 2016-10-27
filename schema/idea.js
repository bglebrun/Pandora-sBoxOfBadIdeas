var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ideaSchema = new Schema({

  message: {type: String, required: true, default: 'My bad idea was not having one'},
  date: {type: Number, required: true, default: Number.MAX_VALUE},
  score: {type: Number, required: true, default: 0}

}, {connect: 'ideas'}, {strict: true})

ideaSchema.pre('save', function (next) {
  console.log('We unforunately saved a new bad idea: ', this.message)
  if (!this.date) {
    this.date = Math.floor((Date.now()))
  }
  next()
})

/* ideaSchema.methods.edit = function (updateObject, next)  {

  var updateJson = {};

  if (updateObject.idea)  {
    updateJson.idea = updateObject.idea;
  }

  if(updateJson === {}) {
    console.log('Invalid JSON');
    next('Invalid');
  } else {
    this.findOneAndUpdate(
      {_id: this._id},
      {$set: updateJson},
      {new: true},
      function (err, idea) {
        if(err) {
          console.log(err);
          next(err);
        } else if (idea) {
          next(null);
        } else {
          console.log('No idea found, thank god');
          next('No idea to spread');
        }
      }
    )};
}
*/

var Idea = mongoose.model('Idea', ideaSchema)

module.exports = Idea
