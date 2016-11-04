var Idea = require('./schema/idea')

var manipulator = {
  createIdea: function (ideaObject, next) {
    Idea.create(ideaObject, function (err, idea) {
      if (err) {
        console.log(err)
        next(err, null)
      } else if (idea) {
        next(null, idea)
      } else {
        console.log('Luckily, your bad idea was never saved, fortunately lost to the pit of time')
        next('Failed', null)
      }
    })
  },

	updateIdea: function(ideaObject, next) {
		Idea.update({message: ideaObject.message}, {
			message: ideaObject.message,
			count: ideaObject.count + 1
		}, function(err, num, res) {
			if (err) {
				console.log(err)
				next(err, null)
			} else if (res) {
				next(null, res)
			} else {
				console.log('For some rason, no object updated')
				next('Failed', null)
			}
		})
	},

  getIdeaByMessage: function (messageInput, next) {
    Idea.findOne({message: messageInput.message}, function (err, idea) {
      if (err) {
        console.log(err)
        next(err)
      } else if (idea) {
        next(null, idea)
      } else {
        console.log('Idea not found, breathe a little better')
        next('Not found', null)
      }
    })
  },

  getIdeaById: function (id, next) {
    Idea.findOne({_id: id}, function (err, idea) {
      if (err) {
        console.log(err)
        next(err)
      } else if (idea) {
        next(null, idea)
      } else {
        console.log('Idea not found, breathe a little better')
        next('Not found', null)
      }
    })
  }
}

module.exports = manipulator
