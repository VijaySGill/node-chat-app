const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/users', function(request, response)
{
  var body = _.pick(request.body, ['name', 'email', 'username', 'password']);

  var user = new User(body);

  user.save().then(function(document)
  {
    response.send(document);
  }).catch(function(error)
  {
    response.status(400).send(error);
  })
});

app.get('/users', function(request, response)
{
  console.log("HI");
});

app.listen(port, function()
{
  console.log(`Started up server on port ${port}`);
});
