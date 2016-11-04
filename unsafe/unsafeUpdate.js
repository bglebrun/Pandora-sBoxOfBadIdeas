var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/injectTest'

var insertDocument = function (doc, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log(err)
      next(err)
    } else {
      console.log('Connected to database, getting our collections to update...\n')
    }

    var collection = db.collection('ideas')

		var ideaInsert = {score: 0, date: Math.floor(Date.now()), message: doc.message, __v: 0)}

    collection.insertOne(ideaInsert, function (err, doc) {
      if (err) {
        next(err)
        db.close()
      } else if (doc) {
        next(doc, null)
        db.close()
      } else {
        next(null, 'Not found')
        db.close()
      }
    })
  })
}

module.exports = insertDocument
