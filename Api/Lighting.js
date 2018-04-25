var winston = require('winston');
var pjson = require('../package.json');
var http = require('http');
var _ = require('lodash');
var async = require('async');

module.exports = function(app, ipAdresses)	{
  app.get('/light/red', function(req, res) {
    winston.debug("GET :: /light/red");
    sendColor(ipAdresses, 'red', function(err, result) {
      return res.send(result);
    })
  });

  app.get('/light/blue', function(req, res) {
    winston.debug("GET :: /light/blue");
    sendColor(ipAdresses, 'blue', function(err, result) {
      return res.send(result);
    })
  });

  app.get('/light/green', function(req, res) {
    winston.debug("GET :: /light/green");
    sendColor(ipAdresses, 'green', function(err, result) {
      return res.send(result);
    })
  });

  app.get('/light/on', function(req, res) {
    winston.debug("GET :: /light/on");
    sendColor(ipAdresses, 'on', function(err, result) {
      return res.send(result);
    })
  });

  app.get('/light/off', function(req, res) {
    winston.debug("GET :: /light/off");
    sendColor(ipAdresses, 'off', function(err, result) {
      return res.send(result);
    })
  });

  app.get('/light/color', function(req, res) {
    winston.debug("GET :: /light/color");
    var red = 0;
    var green = 0;
    var blue = 0;
    if(req.query != undefined) {
      if(req.query.red != undefined) {
        red = req.query.red;
      }
      if(req.query.green != undefined) {
        green = req.query.green;
      }
      if(req.query.blue != undefined) {
        blue = req.query.blue;
      }
    }
    var strColor = 'color?red=' + red + '&green=' + green + '&blue=' + blue;
    sendColor(ipAdresses, strColor, function(err, result) {
      return res.send(result);
    })
  });
};

function sendColor(ipAdresses, color, callback) {
  async.each(ipAdresses, function(ip, callback) {
    console.log("Call ip " + ip + " for " + color);
    const https = require('https');
    sendIpColor(ip, color, function(err, res) {
      callback(err, res);
    });
  }, function(err) {
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('Send Red call error');
    } else {
      console.log('All light should be red');
      callback(null, 'All light should be ' + color)
    }
  });
}

function sendIpColor(ip, color, callback) {
  http.get('http://'+ ip +'/'+ color, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      //console.log(JSON.parse(data));
      return callback(null);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
    return callback(err);
  });
}
