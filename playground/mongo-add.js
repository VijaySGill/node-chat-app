const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ChatApp', { useNewUrlParser: true }, function(error, client)
{
  if(error)
  {
    return console.log('Unable to connect to MongoDB server');
  }

  console.log('Connected to MongoDB server');

  const db = client.db('ChatApp');

  db.collection('Users').insertOne({
    name: 'Vijay Gill',
    email: 'vijaygill@hotmail.co.uk',
    username: 'EVERYTHINGLOVE',
    password: '123abc!'
  }, function(error, result)
  {
    if(error)
    {
      return console.log('Unable to insert document', error);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

    client.close();
}
