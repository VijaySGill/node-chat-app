var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test')
{
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach(function(key)
  {
    process.env[key] = envConfig[key]
  });
}

else if(env === 'production')
{
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach(function(key)
  {
    process.env[key] = envConfig[key]
  });
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET)
{
  throw new Error('JWT_SECRET is required in production!');
}
