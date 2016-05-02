var rp = require('request-promise');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

function generateUUID(){
	var d = Date.now();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	});
	return uuid;
};

app.listen(3000,function(){
console.log("It's Started on PORT 3000");
});
app.use(bodyParser.json());

/*
* Here we will call Database.
* Fetch news from table.
* Return it in JSON.
*/
app.post('/createUser',function(req,res){
  var bod = req.body;
  bod.UserId = generateUUID();
  var options = {
    uri: 'http://ix.cs.uoregon.edu:8080/checkExternalId',
    method: 'POST',
    body:{
      ExternalId: bod.ExternalId
    },
    json: true
  };
  rp(options)
  /* Check Username for existence */
  .then(function(parsedBody){
    console.log(parsedBody);
    bod.FacilitatorIDs = [];
    if(parsedBody.Success==false){
      var options2 = {
        uri: 'http://ix-dev.cs.uoregon.edu:9000/train',
        method: 'POST',
        body:bod,
        json: true
      };
      /* Train the user into the facilitator */
      rp(options2)
      /* Response from training */
      .then(function(parsedBody2){
        console.log(parsedBody2);
        /* Check for success, filter out images that failed */
        if(parsedBody2.Success==true){
          parsedBody2.Images.filter(function(image){
            if(image.isSuccess==true){
              return true;
            }
            return false;
          });
          bod.Images = parsedBody2.Images;
          /* Make call to database to store data */
          var options3 = {
            uri: 'http://ix.cs.uoregon.edu:8080/createUser',
            method: 'POST',
            body: bod,
            json: true
          };
          rp(options3)
          .then(function(parsedBody3){
            console.log(parsedBody3);
            //success?
            res.json({Success: true});
          })
          .catch(function(err3){
            console.log(err3);
          });
        }
      })
      .catch(function(err2){
        console.log(err2);
      });
    }
  })
  .catch(function(err){
    //console.log(parsedBody);
    console.log(err);
  });
	res.json({Success: false});
});

app.post('/login', function(req, res){
  var bod = req.body;
  var options = {
    uri: 'http://ix.cs.uoregon.edu:8080/login',
    method: 'POST',
    body:bod,
    json: true
  };
  rp(options)
  .then(function(parsedBody){
    console.log(parsedBody);
    bod.UserId = parsedBody.UserId;
    bod.FacilitatorIDs = parsedBody.FacilitatorIDs;
    var options2 = {
      uri: 'http://ix-dev.cs.uoregon.edu:9000/verify',
      method: 'POST',
      body:bod,
      json: true
    };
    rp(options2)
    .then(function(parsedBody2){
      console.log(parsedBody2);
      if(parsedBody2.IsSamePerson==true){
        res.json({Success:true})
      }
    })
    .catch(function(err2){
      console.log(err2);
    });
  })
  .catch(function(err){
    console.log(err);
  });
  res.json({Success:false});
