const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:'false'}));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const createUser = require('./users.js').createUser;
const addExercise = require('./users.js').addExercise;
const getUserById = require('./users.js').getUserById;

app.post('/api/users', (req, res, next) => {
  if(req.body.username === '') {
    res.json({'error': 'Error, blank username is invalid.'});
  } else {
    createUser(req.body.username, (err, user) => {
      if (err) {
        next();
      } else {
        res.json({'username': user.username, '_id': user._id});
      }
    });
  }
});

app.post('/api/users/:_id/exercises', (req, res, next) => {
  if (req.body[':_id'] && req.body.description && req.body.duration) {
    addExercise(req.body[':_id'], req.body.description, req.body.duration, req.body.date, (err, user) => {
      if (err) {
        res.json({'Error': 'Error finding or updating user in database.'});
      } else {
        res.json({
          '_id': user._id, 
          'username': user.username, 
          'date': user.log[user.count - 1].date.toDateString(), 
          'duration': user.log[user.count - 1].duration, 
          'description': user.log[user.count - 1].description});
      }
    });
  } else {
    res.json({'Error': 'Cannot process request with missing data.'});
  }
});

app.get('/api/users/:_id/logs', (req, res) => {
  getUserById(req.params._id, (err, user) => {
    if (err) {
      res.json({'Error': 'Error retrieving user!'});
    } else if(user !== null) {
      let response = {'_id': user._id, 'username': user.username};

      const from = req.query.from ? new Date(req.query.from) : null;
      const to = req.query.to ? new Date(req.query.to) : null;
      const limit = req.query.limit ? req.query.limit : null;

      let count = 0;
      const log = user.log.filter((exercise) => {
        let valid = true;
        if (from && exercise.date < from) {
          valid = false;
        }
        if (to && exercise.date > to) {
          valid = false;
        }
        if (limit && count >= limit) {
          valid = false;
        }
        if (valid) {
          count++;
          return exercise;
        }
      });

      if (req.query.from) {
        response.from = from.toDateString();
      }
      if (req.query.to) {
        response.to = to.toDateString();
      }

      response.count = count;
      response.log = [];

      for (let i = 0; i < count; i++) {
        response.log.push({'description': log[i].description, 'duration': log[i].duration, 'date': log[i].date.toDateString()});
      }
      
      res.json(response);
    } else {
      res.json({'Error': 'Error retrieving user!'});
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});