var rp = require('request-promise');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var portNum = 1338;
var databaseURL = "http://ix.cs.uoregon.edu";
var databasePort = 8080;
var facilitatorURL = "http://ix-dev.cs.uoregon.edu";
var facilitatorPort = 8999;
//Not needed anymore since database creates this
app.use(bodyParser.json({limit: '50mb'}));
app.listen(portNum,function(){
console.log("It's Started on PORT " + portNum);
});


app.post('/train', function(req, res){
  var bod = req.body;
  var options = {
    uri: databaseURL + ':' +  databasePort + '/login',
    method: 'POST',
    body:bod,
    json: true
  };
  rp(options)
  .then(function(parsedBody){
    console.log(parsedBody);
    if(parsedBody.success == true){
			parsedBody.pictures = bod.pictures;
	    var options2 = {
	      uri: facilitatorURL + ':' + facilitatorPort + '/train',
	      method: 'POST',
	      body: parsedBody,
	      json: true
	    };
	    rp(options2)
	    .then(function(parsedBody2){
	      console.log(parsedBody2);
	      if(parsedBody2.success==true){
					var options3 = {
				    uri: databaseURL + ':' +  databasePort + '/train',
				    method: 'POST',
				    body:parsedBody2,
				    json: true
				  };
				  rp(options3)
				  .then(function(parsedBody3){
						if(parsedBody3.success==true){
							res.json({success: true});
						}
					}.catch(function(err3){
						console.log(err3.response.body);
						err3.success=false;
						res.json(err3.response.body);
					})
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
  //res.json({success:false});
});

app.post('/register',function(req,res){
  var bod = req.body;
  /*var options = {
    uri: facilitatorURL + ':' + facilitatorPort + '/register',
    method: 'POST',
    body:bod,
    json: true
  };
  rp(options)
  /* Get facilitator response */
  /*.then(function(parsedBody){
    console.log(parsedBody);
		//parsedBody should have FacilitatorIDs
    //bod.FacilitatorIDs = [];
    if(parsedBody.success==true){
			parsedBody.pictures = bod.pictures;*/
      var options2 = {
        uri: databaseURL + ':' +  databasePort + '/register',
        method: 'POST',
        body: bod,
        json: true
      };
      /* Train the user into the database */
      rp(options2)
      /* Response from database */
      .then(function(parsedBody2){
        console.log(parsedBody2);
        /* Check for success, filter out images that failed */
        if(parsedBody2.success==true){
          res.json(parsedBody2);
        }
      })
      .catch(function(err2){
        console.log(err2.response.body);
				err2.success=false;
				res.json(err2.response.body);
      });
    //}
  //})
  /*.catch(function(err){
    //console.log(parsedBody);
    console.log(err);
		err.success=false;
		res.json(err);
  });*/
	//res.json({success: false});
});

app.post('/login', function(req, res){
  var bod = req.body;
  var options = {
    uri: databaseURL + ':' +  databasePort + '/login',
    method: 'POST',
    body:bod,
    json: true
  };
  rp(options)
  .then(function(parsedBody){
    console.log(parsedBody);
    if(parsedBody.success == true){
			parsedBody.picture = bod.picture;
	    var options2 = {
	      uri: facilitatorURL + ':' + facilitatorPort + '/login',
	      method: 'POST',
	      body: parsedBody,
	      json: true
	    };
	    rp(options2)
	    .then(function(parsedBody2){
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
    console.log(err);
		err.success=false;
		res.json(err.response.body);
  });
  //res.json({success:false});
});
