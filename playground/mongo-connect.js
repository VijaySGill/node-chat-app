const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ChatApp', { useNewUrlParser: true }, function(error, client)
{
  if(error)
  {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('ChatApp');

  client.close();
});
