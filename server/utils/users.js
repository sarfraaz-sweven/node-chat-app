const _ = require('lodash');
const {Sessions} = require('./sessions');

class Users {
  constructor () {
    this.users = [];
  }

  getIndex (room) {
    var room_users = this.users.filter((user)=> user.room === room);
    var i = 1;
    while(true)
    {
      var t = room_users.filter((user)=> user.index === i);
      if(!t[0])
      {
        break;
      }
      i++;
    }
    return i;
  }

  addUser (id,name,room,random) {
    var index = this.getIndex(room);
    var move = "";
    var user = {id,name,room,random,index,move};
    this.users.push(user);
    return user;
  }

  removeUser (id)
  {
    var user = this.users.filter((user)=> user.id === id)[0];
    if(user)
      this.users = this.users.filter((user)=> user.id !== id);
    return user;
  }

  getUser (id)
  {
    var user = this.users.filter((user)=> user.id === id)[0];
    return user;
  }

  getOther (id)
  {
    var room = this.users.filter((user)=> user.id === id)[0].room;
    var user = this.users.filter((user)=> {
      if(user.room === room)
      {
        if(user.id !== id)
          return user;
      }
    })[0];

    return user;
  }

  getUserList (room)
  {
    var users = this.users.filter((user)=> user.room === room);
    var namesArray = users.map((user) => _.pick(user,['name','index']));
    return namesArray;
  }

  getCount (room) {
    return this.users.filter((user)=> user.room === room).length;
  }

  getSequence (room) {
    var index = Math.floor((Math.random() * 2) + 1);
    var seq = {};
    seq.first = this.users.filter((user)=> {
      if(user.room === room)
      {
        if(user.index === index)
        {
          user.move = "o";
          return user;
        }
      }
    })[0];
    seq.second = this.users.filter((user)=> {
      if(user.room === room)
      {
        if(user.index !== index)
        {
          user.move = "x";
          return user;
        }
      }
    })[0];
    var others = this.users.filter((user)=> {
      if(user.room !== room)
          return user;
    });
    this.users = others;
    this.users.push(seq.first);
    this.users.push(seq.second);
    console.log(this.users);
    return seq;
  }

  getVacantRoom (ary, classifier) {
    classifier = classifier || String;
    var counts = ary.reduce(function (counter, item) {
      var p = classifier(item);
      counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
      return counter;
    }, {});

    var final = [];
    //var rooms = counts.filter((count)=> count < 5);
    for(var key in counts) {
      if(counts[key] < 2)
      final.push({'room':key,'count':counts[key]});
    }

    if(final.length > 0)
      return final[0].room;
    else {
      return false;
    }
  };

  getRandomRoom ()
  {
    var random_users = this.users.filter((user)=> user.random === true);

    var vacant_room = this.getVacantRoom(random_users, function (item) {
        return item.room;
    });

    if(!vacant_room)
      return (Math.random()*1e16).toString(36)+(Math.random()*1e16).toString(36);
    else {
      return vacant_room;
    }
  }
}
module.exports = {Users};
