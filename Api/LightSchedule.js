var winston = require('winston');
var pjson = require('../package.json');
var _ = require('lodash');

module.exports = function(app, schedule, ipAdresses)	{
  app.get('/light/actions', function(req, res) {
    winston.debug("GET :: /light/actions");
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(':')[3];
    winston.debug("ip = " + ip + "::" + _.includes(ipAdresses, ip));
    winston.debug("ip addrs = " + ipAdresses);
    if(false == _.includes(ipAdresses, ip)) {
      winston.debug("add ip " + ip);
      ipAdresses.push(ip);
    } else {
      winston.debug("already have " + ip);
    }
    schedule.getActiveActions(function(err, result){
      var lightResult = "";
      winston.debug(result);
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
