var winston = require('winston');
var scheduler = require('node-schedule');

var actionState = {
  PENDING: 1, // Should be done
  FINISHED: 2, // Is done
  UNKNOWN: 3,
};

// List of active actions
var actions = [];

// List of schedules to be planned
var schedules = [
  {
    name: 'Task Stofzuigen',
    cronInterval: '* * * * *',
    action: 'Stofzuigen',
    rgbcolor: {red:255, green:255, blue:0}
  },
  {
    name: 'Task Wassen',
    cronInterval: '*/2 * * * *',
    action: 'Wassen',
    rgbcolor: {red:0, green:255, blue:255}
  },
  {
    name: 'Task Afwassen',
    cronInterval: '*/2 * * * *',
    action: 'Afwassen',
    rgbcolor: {red:255, green:0, blue:255}
  }
];

module.exports = {
//https://crontab.guru/#*_*_*_*_*
  initialize: function()
  {
    schedules.forEach( function(schedule) {
      console.log("Found Schedule");
      console.log(schedule);
      actions.push({name: schedule.action, state: actionState.UNKNOWN, color: schedule.rgbcolor});
      var j = scheduler.scheduleJob(schedule.name, schedule.cronInterval, function(task, schedule){
        console.log("Find action : " + schedule.action);
        for(var aI = 0; aI < actions.length; aI++) {
          console.log("action " + aI + " with name " + actions[aI].name);
          // if(actions[aI].name == schedule.action) {
          //   console.log("action found");
          //   if(actions[aI].state == actionState.FINISHED) {
          //     actions[aI].state = actionState.PENDING;
          //   } else {
          //     actions[aI].state = actionState.FINISHED;
          //   }
          // }
        }
        //console.log(j.nextInvocation());
        console.log('Ga nu ' + task);
        console.log('Volgende is op ' + schedule.job.nextInvocation());
      }.bind(null, schedule.action, schedule));
      schedule.job = j;
      //console.log(j);
      console.log(schedule.name + " staat geplanned voor " + j.nextInvocation());
    });

    actions.forEach(function(action){
      console.log('state : ' + action.state + ' -- name : ' + action.name);
    });
    setInterval(function() {
      actions.forEach(function(action){
        console.log('state : ' + action.state + ' -- name : ' + action.name);
      });
    }, 10 * 1000); // 30 seconds
  },

  /* ------------------------------------------------------------------------
   * Handle actions calls
   * getActions
   * getActivaActions
   * updateActions
   */
  getActions: function(callback)
  {
    callback(null, actions);
  },

  getActiveActions: function(callback)
  {
    var aActions = [];
    for(var aI = 0; aI < actions.length; aI++) {
      if(actions[aI].state == actionState.PENDING) {
        aActions.push(actions[aI]);
      }
    }
    callback(null, aActions);
  },

  updateAction: function(action, state, callback)
  {
    for(var aI = 0; aI < actions.length; aI++) {
      console.log("update action " + aI + " with name " + actions[aI].name);
      if(actions[aI].name == action) {
        console.log("action updated");
        actions[aI].state = state;
        return callback(null, actions[aI]);
      }
    }
    return callback(null, null);
  },

  /* ------------------------------------------------------------------------
   * Handle schedule calls
   * getSchedule
   */
  getSchedule: function(name, callback)
  {
    for(var sI = 0; sI < schedules.length; sI++) {
      if(schedules[sI].action == name) {
        var result = schedules[sI];
        result.nexttime = schedules[sI].job.nextInvocation();
        return callback(null, result);
      }
    }
    return callback(null, null);
  }
}
