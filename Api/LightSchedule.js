var winston = require('winston');
var pjson = require('../package.json');
var _ = require('lodash');

module.exports = function(app, schedule, ipAdresses)	{
  app.get('/light/actions', function(req, res) {
    winston.debug("GET :: /light/actions");
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(':')[3];
    console.log("ip = " + ip + "::" + _.includes(ipAdresses, ip));
    console.log("ip addrs = " + ipAdresses);
    if(false == _.includes(ipAdresses, ip)) {
      console.log("add ip " + ip);
      ipAdresses.push(ip);
    } else {
      console.log("already have " + ip);
    }
    schedule.getActiveActions(function(err, result){
      var lightResult = "";
      console.log(result);
      if(result.length != 0) {
        lightResult = "" + result.length + "\n";
      }
      result.forEach(function(action){
        //R,G,B
        lightResult += action.color.red +":"+ action.color.green +":"+ action.color.blue + ":\n";
      });
      if(lightResult == "") {
        lightResult = "0\nstandby\n";
      }
      winston.silly("Get result / actions");
      return res.send(lightResult);
    });
  });
};
