const Microservices = require('./../lib/Microservices');

const http = require('http');
const server = http.createServer();

let microservice = new Microservices();




microservice.register({
  name: 'Algo'
})

server.listen(10002, () => {
  console.log('Server run');
});