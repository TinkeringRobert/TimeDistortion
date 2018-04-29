// List of schedules to be planned
var schedules = [
  {
    name: 'Task Stofzuigen',
    cronInterval: '00 17 * * 4',
    action: 'Stofzuigen',
    rgbcolor: {red:255, green:255, blue:0}
  },
  {
    name: 'Task Wassen',
    cronInterval: '00 17 * * 2',
    action: 'Wassen',
    rgbcolor: {red:0, green:255, blue:255}
  },
  {
    name: 'Task Afwassen',
    cronInterval: '00 17 * * 2',
    action: 'Afwassen',
    rgbcolor: {red:255, green:0, blue:255}
  },
  {
    name: 'Task Planten water geven',
    cronInterval: '00 20 * * 1,3,6',
    action: 'Water-geven',
    rgbcolor: {red:111, green:111, blue:255}
  }
];

module.exports = {
  getSchedule: function () {
    return schedules;
  }
}
