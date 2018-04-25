// Local requires
var winston = require('winston');
var schedule = require('./Schedule');

module.exports = {
	initialize: function(params, dbPool)
	{
		winston.debug('Starting : ModuleInit');
		schedule.initialize();
	}
}
