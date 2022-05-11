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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
