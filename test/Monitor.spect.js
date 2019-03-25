const http = require('http');
const server = http.createServer();
const Monitor = require('./../lib/Monitor');

let monitor = new Monitor();

monitor.discover();


server.listen(10001, () => {
  console.log('Server run');
});
// //create a server object:
// http.createServer((req, res) => {
//   res.write('Hello World!'); //write a response to the client
//   res.end(); //end the response
// }).listen(8080); //the server object listens on port 8080