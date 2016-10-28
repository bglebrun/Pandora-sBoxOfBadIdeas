var express = require('express')
var app = express()
var mongoose = require('mongoose')
var manipulator = require('./manipulator.js')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var httpstatus = require('http-status-codes')
var getRand = require('./unsafe/getrand')
var unsafeUpdate = require('./unsafe/unsafeUpdate')
const exec = require('child_process').exec

mongoose.connect('localhost:27017')

exec("echo 'execution is working'")

console.log('Connection established to MongoDB')

app.use(morgan('combined'))

app.disable('etag')

app.use(bodyParser.json())

app.route('/rand')
.get(function (req, res) {
  var doc, err
  getRand.safeGet(doc, err, function (doc, err) {
    if (err) {
      res.status(httpstatus.BAD_REQUEST).send()
    } else if (doc) {
      res.send(doc)
    } else {
      res.status(httpstatus.NOT_FOUND).send()
    }
  })
})

app.route('/unsafeRand')
.get(function (req, res) {
  var doc, err
  getRand.unsafeGet(doc, err, function (doc, err) {
    if (err) {
      res.status(httpstatus.BAD_REQUEST).send()
    } else if (doc) {
      res.send(doc)
    } else {
      res.status(httpstatus.NOT_FOUND).send()
    }
  })
})

app.route('/inject')
.post(function (req, res) {
  unsafeUpdate(req.body.idea, function (doc, err) {
    if (err) {
      console.log(err)
      res.status(httpstatus.BAD_REQUEST).send()
    } else if (doc) {
      res.json({
        _id: doc._id,
        response: 'Your idea was unfortunately saved',
        message: req.body.idea.message
      })
    } else {
      console.log('Nothing updated')
      res.status(httpstatus.NOT_FOUND).send()
    }
  })
})

app.route('/ideas/:id')
.get(function (req, res) {
  manipulator.getIdeaById(req.params.id, function (err, idea) {
    if (err) {
      res.status(httpstatus.BAD_REQUEST).send()
    } else if (idea) {
      res.send(idea)
    } else {
      res.status(httpstatus.NOT_FOUND).send()
    }
  })
})
.all(function (req, res) {
  res.status(httpstatus.BAD_REQUEST).send()
})

app.route('/ideas/:message')
.get(function (req, res) {
  manipulator.getIdeabyMessage(req.params.id, function (err, idea) {
    if (err && err !== 'Not found') {
      console.log(err)
      res.status(httpstatus.BAD_REQUEST).send()
    } else if (idea) {
      res.json({
        _id: idea._id,
        response: "Here's what we found: ",
        message: idea.message
      })
    } else {
      console.log('Seems we didn\'t find our message, don\'t take that as an invitation though.')
      res.status(httpstatus.NOT_FOUND).send()
    }
  })
})

app.route('/idea')
.post(function (req, res) {
  manipulator.getIdeaByMessage(req.body.idea, function (err, results) {
    if (err && err !== 'Not found') {
      console.log(err)
      res.status(httpstatus.BAD_REQUEST).send()
    } else if (results) {
      res.json({
        _id: results._id,
        response: 'Your idea was already there, horrible minds think alike',
        message: results.message
      })
    } else {
      manipulator.createIdea(req.body.idea, function (err, idea) {
        if (err) {
          res.status(httpstatus.BAD_REQUEST).send()
        } else if (idea) {
          res.json({
            _id: idea._id,
            response: 'Your idea was unfortunately saved',
            message: idea.message
          })
        } else {
          console.log('Idea not inserted, nothing added')
          res.status(httpstatus.NOT_FOUND).send()
        }
      })
    }
  })
})

app.listen(3000)

console.log('App listening on port 3000')

console.log('NOTE: We take no responsibilty for any bad ideas stored here. Your mother should have taught you better.\n')
