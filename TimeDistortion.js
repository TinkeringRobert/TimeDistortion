var pjson = require('./package.json');

var bodyParser = require('body-parser');
var express = require('express')
      ,cors = require('cors')
      ,app = express();
var winston = require('winston');

var modules = require('./Controllers/ModuleInit');

//*************************************************************************
// Application settings
//*************************************************************************
var isWin = /^win/.test(process.platform);
if (isWin){
  var params = require('../Gravitation/Windows');
}
else{
  var params = require('../Gravitation/Linux');
}
//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
winston.level = 'debug';

//*************************************************************************
// Local requires
//*************************************************************************
var schedule = require('./Controllers/Schedule');
var ipAddresses = ['10.0.0.14','10.0.0.12'];
//*************************************************************************
// Service http functions
//*************************************************************************
var originsWhitelist = [
  'http://localhost:4200'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:false
}
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/status', function (req, res) {
  res.json(
    {
      status: 'online',
      application: pjson.name,
      version: pjson.version,
      description: pjson.description
    }
  );
});

require('./Api/Actions.js')(app, schedule);
require('./Api/LightSchedule.js')(app, schedule, ipAddresses);
require('./Api/Lighting.js')(app, ipAddresses);
// routes ======================================================================
function initialize(){
  console.log('Boot Home automation server :: ' + pjson.name + ' :: ' + pjson.version);
  // Activate website
  app.listen(params.application_port.time_distortion, function () {
      modules.initialize();
      console.log('Server gestart op poort ' + params.application_port.time_distortion);
  });

  winston.info("System started");
};

initialize();
