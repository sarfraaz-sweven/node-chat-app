const _ = require('lodash');
// addUser(id,name,room)
// removeUser(id)
// getUser(id)
// getUserList(room)

//
// class Person () {
//   constructor (name,age) {
//     this.name = name;
//     this.age = age;
//   }
//
//   getUserDescription () {
//     return `${this.name} is ${this.age} year(s) old`;
//   }
// }

class Users {
  constructor () {
    this.users = [];
    this.matrix = [],
    this.cols = 3;

    //init the grid matrix
    for ( var i = 0; i < this.cols; i++ ) {
        this.matrix[i] = [];
    }

    for ( var i = 0; i < this.cols; i++ ) {
      for ( var j = 0; j < this.cols; j++ ) {
        this.matrix[i][j] = '*';
      }
    }

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
    var user = this.users.filter((user)=> user.id !== id)[0].id;
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
    console.log('index',index)
    var seq = {};
    seq.first = this.users.filter((user)=> {
        if(user.index === index)
        {
          user.move = "o";
          return user;
        }
    })[0];
    seq.second = this.users.filter((user)=> {
        if(user.index !== index)
        {
          user.move = "x";
          return user;
        }
    })[0];
    this.users = [seq.first,seq.second];
    seq.first = seq.first.id;
    seq.second = seq.second.id;
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

  plotMove (id,position) {
    console.log(position);
    var a = position.toString().split("");
    console.log(a);
    var cords = a.map(function (x) {
        return parseInt(x, 10);
    });
    console.log(cords);

    var move = this.users.filter((user)=> user.id === id)[0].move;
    console.log(move);

    var x_cord = cords[0];
    var y_cord = cords[1];
    console.log(x_cord);
    console.log(y_cord);
    this.matrix[x_cord][y_cord] = move;
    return move;
  }

  getResult(move)
  {
    var res = false;

    if(
        (this.matrix[0][0] === this.matrix[0][1] === this.matrix[0][2])
        ||
        (this.matrix[1][0] === this.matrix[1][1] === this.matrix[1][2])
        ||
        (this.matrix[2][0] === this.matrix[2][1] === this.matrix[2][2])
        ||
        (this.matrix[0][0] === this.matrix[1][0] === this.matrix[2][0])
        ||
        (this.matrix[0][1] === this.matrix[1][1] === this.matrix[2][1])
        ||
        (this.matrix[0][2] === this.matrix[1][2] === this.matrix[2][2])
        ||
        (this.matrix[0][0] === this.matrix[1][1] === this.matrix[2][2])
        ||
        (this.matrix[0][2] === this.matrix[1][1] === this.matrix[2][0])
      )
      {
        res = true;
      }

      return res;
  }

  moveLeft()
  {
    var i,j; 
    for(i = 0;i < this.cols; i++)
    {
      for(j = 0;i < this.cols; j++)
      {
        if(this.matrix[i][j] === '*')
          return true;
      }
    }
    return false;
  }

}

module.exports = {Users};
