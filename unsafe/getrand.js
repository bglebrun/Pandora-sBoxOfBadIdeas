var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/test'

var getRand = function (doc, err, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log(err)
      next(err)
    } else {
      console.log('Connected to database, getting our collection...\n')
    }

    var collection = db.collection('ideas')

    collection.aggregate([
        {$sample: {size: 1}}
    ], function (err, doc) {
      if (err) {
        console.log(err)
        next(err)
        db.close()
      } else if (doc) {
        next(doc, null)
        db.close()
      } else {
        console.log('Document not found, breathe a little easier')
        next(null, 'Not found')
        db.close()
      }
    })
  })
}

module.exports = getRand
