var rp = require('request-promise');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var portNum = 1337;
var databaseURL = "http://ix.cs.uoregon.edu";
var databasePort = 8080;
var facilitatorURL = "http://ix-dev.cs.uoregon.edu";
var facilitatorPort = 8999;
//Not needed anymore since database creates this
/*
function generateUUID(){
	var d = Date.now();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	});
	return uuid;
};
*/
app.use(bodyParser.json({limit: '50mb'}));
app.listen(portNum,function(){
console.log("It's Started on PORT " + portNum);
});
app.use(bodyParser.json());

/*
*  Creates a user. Call path is:
*  I receieved call, make call to facilitator,
*  then I make call to db to save
*  then I return the uuid
*/
app.post('/register',function(req,res){
  var bod = req.body;
  var options = {
    uri: facilitatorURL + ':' + facilitatorPort + '/register',
    method: 'POST',
    body:bod,
    json: true
  };
console.log("---------------Recieved Register Request----------------");
console.log(bod);
	console.log("=-=-=-=-=-=Calling Facilitator=-=-=-=-=-=-=-=-=");
  rp(options)
  /* Get facilitator response */
  .then(function(parsedBody){
	console.log("************Received Response from Facilitator****************");
    console.log(parsedBody);
		//parsedBody should have FacilitatorIDs
    //bod.FacilitatorIDs = [];
    if(parsedBody.success==true){
			parsedBody.pictures = bod.pictures;
      var options2 = {
        uri: databaseURL + ':' +  databasePort + '/register',
        method: 'POST',
        body: parsedBody,
        json: true
      };
      /* Train the user into the database */
	console.log("`````````Calling Database```````````");
      rp(options2)
      /* Response from database */
      .then(function(parsedBody2){
	console.log("^^^^^^^^^^^^Recieved Response from Database^^^^^^^^^^^^^^^");
        console.log(parsedBody2);
        /* Check for success, filter out images that failed */
        if(parsedBody2.success==true){
          res.json(parsedBody2);
		return;
        }
      })
      .catch(function(err2){
        console.log(err2.response.body);
				err2.success=false;
				res.json(err2.response.body);
      	return;
	});
    }else{
	res.json(parsedBody);
    }
  })
  .catch(function(err){
    //console.log(parsedBody);
    console.log(err.response.body);
		err.success=false;
		res.json(err.response.body);
  return;
	});
//	res.json({success: false});
});

app.post('/login', function(req, res){
  var bod = req.body;
  var options = {
    uri: databaseURL + ':' +  databasePort + '/login',
    method: 'POST',
    body:bod,
    json: true
  };
	console.log("---------------------Recieved login request---------------------");
console.log(bod);
	console.log("=-=-=-=-=-=-=-=-=-=-=Calling Database-=-=-=-=-=-=-=-=-=-=");
  rp(options)
  .then(function(parsedBody){
	console.log("%%%%%%%%%%%Recieved response from database%%%%%%%%%%%%%");
    console.log(parsedBody);
    if(parsedBody.success == true){
			parsedBody.picture = bod.picture;
	    var options2 = {
	      uri: facilitatorURL + ':' + facilitatorPort + '/login',
	      method: 'POST',
	      body: parsedBody,
	      json: true
	    };
		console.log("+++++++++++++++Calling Facilitator+++++++++++++");
	    rp(options2)
	    .then(function(parsedBody2){
	console.log("*************Received Response from Facilitator******************");
	      console.log(parsedBody2);
	      if(parsedBody2.success==true){
	        res.json({success: true})
	      }else{
					res.json(parsedBody2);
				}
	    })
	    .catch(function(err2){
	      console.log(err2.response.body);
				err2.success=false;
				res.json(err2.response.body);
	    });
		}
  })
  .catch(function(err){
    console.log(err.response.body);
		err.success=false;
		res.json(err.response.body);
  });
//  res.json({success:false});
});
