
class Sessions {

  constructor() {
    this.sessions = [];
  }

  startSession(room) {
    var matrix = [];

    //init the grid matrix
    for ( var i = 0; i < 3; i++ ) {
        matrix[i] = [];
    }

    for ( var i = 0; i < 3; i++ ) {
      for ( var j = 0; j < 3; j++ ) {
        matrix[i][j] = '*';
      }
    }

    var currentMove = 0;

    var session = {room,matrix,currentMove};

    this.sessions.push(session);
  }

  getSession(room) {
    var session =  this.sessions.filter((session)=> session.room === room)[0];
    console.log(`Session : ${session}`);
    return session;
  }

  plotMove(room,move,position) {
    var session = this.getSession(room);

    var a = position.toString().split("");
    var cords = a.map(function (x) {
        return parseInt(x, 10);
    });

    var x = cords[0];
    var y = cords[1];

    session.matrix[x][y] = move;

    return move;
  }

  getResult(room)
  {
    var session = this.getSession(room);

    if(
        (session.matrix[0][0] == session.matrix[0][1]) && (session.matrix[0][0] == session.matrix[0][2]) && (session.matrix[0][0] !== '*')
        ||
        (session.matrix[1][0] == session.matrix[1][1]) && (session.matrix[1][0] == session.matrix[1][2]) && (session.matrix[1][0] !== '*')
        ||
        (session.matrix[2][0] == session.matrix[2][1]) && (session.matrix[2][0] == session.matrix[2][2]) && (session.matrix[2][0] !== '*')
        ||
        (session.matrix[0][0] == session.matrix[1][1]) && (session.matrix[0][0] == session.matrix[2][2]) && (session.matrix[0][0] !== '*')
        ||
        (session.matrix[0][0] == session.matrix[1][0]) && (session.matrix[0][0] == session.matrix[2][0]) && (session.matrix[0][0] !== '*')
        ||
        (session.matrix[0][1] == session.matrix[1][1]) && (session.matrix[0][1] == session.matrix[2][1]) && (session.matrix[0][1] !== '*')
        ||
        (session.matrix[0][2] == session.matrix[1][2]) && (session.matrix[0][2] == session.matrix[2][2]) && (session.matrix[0][2] !== '*')
        ||
        (session.matrix[0][2] == session.matrix[1][1]) && (session.matrix[0][2] == session.matrix[2][0]) && (session.matrix[0][2] !== '*')
      )
      {
        return true;
      }

      return false;
  }

  moveLeft(room)
  {
    var session = this.getSession(room);
    var i,j;
    var empty = 0;
    for(i = 0;i < 3; i++)
    {
      for(j = 0;j < 3; j++)
      {
        if(session.matrix[i][j] === '*')
            empty++;
      }
    }
    return empty;
  }

  clearMatrix(room)
  {
    var session = this.getSession(room);
    var i,j;
    var empty = 0;
    for(i = 0;i < 3; i++)
    {
      for(j = 0;j < 3; j++)
      {
        session.matrix[i][j] = '*';
      }
    }
  }

  setCurrentMove(room,id)
  {
    var session = this.getSession(room);
    session.currentMove = id;
  }

  myCurrentMove(room,id)
  {
    var session = this.getSession(room);
    if(session)
    {
      if(session.currentMove === id)
        return true;
      else {
        return false;
      }
    }
    else {
        return false;
    }
  }
}


module.exports = {Sessions};
