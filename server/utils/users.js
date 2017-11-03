
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
  }

  addUser (id,name,room,random) {
    var user = {id,name,room,random};
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

  getUserList (room)
  {
    var users = this.users.filter((user)=> user.room === room);
    var namesArray = users.map((user) => user.name);
    return namesArray;
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
      if(counts[key] < 5)
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
