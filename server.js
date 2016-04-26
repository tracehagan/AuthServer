var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.listen(3000,function(){
console.log("It's Started on PORT 3000");
});
app.use(bodyParser.json());

/*
* Here we will call Database.
* Fetch news from table.
* Return it in JSON.
*/
app.post('/login',function(req,res){
  console.log(req.body);
  res.send("fuck you");
});
