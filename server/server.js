const path = require('path');
const express = require('express');

const public_Path = path.join(__dirname,'/../public');
const port = process.env.PORT || 3000;
var app = express();

app.use(express.static(public_Path));

app.listen(port,()=>{
  console.log(`Server started at port : ${port}`);
});
