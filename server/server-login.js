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
  var user = response.body;
  console.log(user);
});

app.listen(port, function()
{
  console.log(`Started up server on port ${port}`);
});
