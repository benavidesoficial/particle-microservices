const root = require('app-root-path');
const Microservices = require(`${root}/lib/Microservices`);
const Messages = require(`${root}/lib/Messages`);

module.exports.Microservices = new Microservices();