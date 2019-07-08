const Microservices = require('./lib/Microservices');
const Messages = require('./lib/Messages');
const Events = require('./lib/Events');

module.exports.Microservices = new Microservices();
module.exports.Events = Events;