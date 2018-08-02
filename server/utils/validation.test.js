const expect = require('expect');

const {isRealString} = require('./validation.js');

describe('validation', function()
{
  it('should reject non-string values', function()
  {
    var string = 90;

    expect(isRealString(string)).toBe(false);
  });

  it('should reject string with only spaces', function()
  {
    var string = '      ';

    expect(isRealString(string)).toBe(false);
  });

  it('should allow string with non-space characters', function()
  {
    var string = 'hello';

    expect(isRealString(string)).toBe(true);
  });
});
