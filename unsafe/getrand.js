var MongoClient = require('mongodb').MongoClient
var urlSafe = 'mongodb://localhost:27017/test'
var urlUnsafe = 'mongodb://localhost:27017/ritaInjectTest'

var getRand = {
  safeGet: function (doc, err, next) {
    MongoClient.connect(urlSafe, function (err, db) {
      if (err) {
        console.log(err)
        next(err)
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
        } // else
      }) // aggregate
    }) // MongoClient connect
  }, // safe get

  unsafeGet: function (doc, err, next) {
    MongoClient.connect(urlUnsafe, function (err, db) {
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
        } // else
      }) // aggregate
    }) // MongoClient connect
  } // Unsfe get
} // getRand function

module.exports = getRand
