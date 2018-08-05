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
  User.find().toArray().then(function(documents)
  {
    console.log('Users in the database:');
    console.log(JSON.stringify(documents, undefined, 2));
  }, function(error)
  {
    console.log('Unable to fetch users', error);
  });

  // User.find({
  //   _creator: request.user._id // find all todos created by currently logged-in user
  // }).then(function(todos)
  // {
  //   response.send(
  //   {
  //     todos: todos // easier to send as an object if ever I need to tack something on
  //   });
  // }, function(error)
  // {
  //   response.status(400).send(error);
  // });
});

app.listen(port, function()
{
  console.log(`Started up server on port ${port}`);
});
