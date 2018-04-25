var winston = require('winston');
var pjson = require('../package.json');

module.exports = function(app, schedule)	{
  app.get('/active/actions', function(req, res) {
    winston.debug("GET :: active/actions");

    schedule.getActiveActions(function(err, result){
      winston.silly("Get result / actions");
      return res.send(result);
    });
  });

  app.get('/actions', function(req, res) {
		winston.debug("GET :: /actions");

		schedule.getActions(function(err, result){
      winston.silly("Get result / actions");
			return res.send(result);
		});
	});

  app.get('/schedule/:name', function(req, res) {
		winston.debug("GET :: /schedule/:name");
    var name = req.params.name;
    winston.debug(name);
		schedule.getSchedule(name, function(err, result){
      winston.silly("Get result / schedule");
			return res.send(result);
		});
	});

  // Add new node // POST action and states
  app.post('/action/:action/:states', function(req, res) {
    var action = req.params.action;
    var states = req.params.states;
    schedule.updateAction(action, states, function(err, result){
      winston.silly("Update result / actions");
			return res.send(result);
		});
  });
};
