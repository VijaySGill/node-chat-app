class Users
{
  constructor()
  {
    this.users = [];
  }

  addUser(id, name, room)
  {
    var user = {
      id: id,
      name: name,
      room: room
    };

    this.users.push(user);
    return user;
  }

  removeUser(id)
  {
    var user = this.getUser(id);

    if(user)
    {
      this.users = this.users.filter(function(user)
      {
        return user.id !== id; // return all users who don't match that id to create new array
      });
    }

    return user;
  }

  getUser(id)
  {
    var user = this.users.filter(function(user)
    {
      return user.id === id;
    });

    return user[0];
  }

  getUserList(room)
  {
    var users = this.users.filter(function(user)
    {
      return user.room === room;
    });

    var namesArray = users.map(function(user)
    {
      return user.name;
    });

    return namesArray;
  }
}

module.exports = {
  Users: Users
};
