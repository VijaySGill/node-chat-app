var expect = require('expect');

var {generateMessage} = require('./message.js');

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
