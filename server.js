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
        res.json(user);
      }
    });
  } else {
    res.json({'Error': 'Cannot process request with missing data.'});
  }
});

app.get('/api/users/:_id/logs', (req, res) => {
  getUserById(id, (err, user) => {
    if (err) {
      res.json({'Error': 'Error retrieving user!'});
    } else {
      if (req.params.from && req.params.to && req.params.limit) {
        
      }
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})