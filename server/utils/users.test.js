const expect = require('expect');

const {Users} = require('./users.js');

describe('Users', function()
{
  var users;

  beforeEach(function()
  {
    users = new Users();

    users.users = [{
      id: '1',
      name: 'Vijay',
      room: 'Node Course'
    },{
      id: '2',
      name: 'Beyoncé',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Tina',
      room: 'Node Course'
    }];
  });

  it('should add new user', function()
  {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Vijay',
      room: 'The Office Fans'
    };

    var responseUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', function()
  {
    var userID = '1';
    var user = users.removeUser(userID);

    expect(user.id).toBe('1');
    expect(users.users.length).toBe(2);
  });

  it('should not remove user where id is not valid', function()
  {
    var userID = '9876';
    var user = users.removeUser(userID);

    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should get user', function()
  {
    var user = users.getUser(users.users[1].id);

    expect(user.name).toBe('Beyoncé');
  });

  it('should not get user where id is not valid', function()
  {
    fakeID = '5';

    var user = users.getUser('5');

    expect(user).toNotExist();
  });

  it('should return names for node course room', function()
  {
    var userList = users.getUserList('Node Course');

    expect(userList).toEqual(['Vijay', 'Tina']);
  });

  it('should return names for react course', function()
  {
    var userList = users.getUserList('React Course');

    expect(userList).toEqual(['Beyoncé']);
  });
});
