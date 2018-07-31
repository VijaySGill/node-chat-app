var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', function()
{
  it('should generate the correct message object', function()
  {
    var from = 'Vijay';
    var text = 'Hey. This is Vijay.'

    var message = generateMessage(from, text);

    expect(message).toInclude({
      from: from,
      text: text
    });

    expect(message.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', function()
{
  it('should generate correct location object', function()
  {
    var latitude = 1;
    var longitude = 1;
    var from = 'Vijay';

    var message = generateLocationMessage(from, latitude, longitude);

    expect(message).toInclude({
      from: from,
      url: `https://www.google.com/maps?q=${latitude},${longitude}`
    });

    expect(message.createdAt).toBeA('number');
  });
});
