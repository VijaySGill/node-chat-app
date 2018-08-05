const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ChatApp', { useNewUrlParser: true }, function(error, client)
{
  if(error)
  {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('ChatApp');

  db.collection('Users').find().toArray().then(function(documents)
  {
    console.log('Users in the database:');
    console.log(JSON.stringify(documents, undefined, 2));
  }, function(error)
  {
    console.log('Unable to fetch users', error);
  });

  client.close();
}