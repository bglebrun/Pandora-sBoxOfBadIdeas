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

    var docInsert = { score: 0, date: Math.floor((Date.now())), message: doc.message, __v: 0 }

    collection.insertOne(docInsert, function (err, doc) {
      if (err) {
        console.log(err)
        console.log('What we were trying to insert: ', docInsert)
        next(err)
        db.close()
      } else if (doc) {
        console.log('Success! Inserted: ', docInsert)
        next(docInsert, null)
        db.close()
      } else {
        console.log('Unsafe update was called, but nothing inserted')
        console.log('Object to insert was: ', docInsert)
        console.log('Error thrown was: ', err, '\n')
        next(null, 'Not found')
        db.close()
      }
    })
  })
}

module.exports = insertDocument
