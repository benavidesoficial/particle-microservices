const uuid = require('uuid/v4');
// const glob = require("glob");
// const exec = require('child_process').exec;
// const mergePkg = require('merge-pkg');
// const fs = require('fs');

class Microservices {

  constructor() {
    this.microservice = {};
    this.nameService = null;
    // this.express = app;
  }

  setConfig(microservice) {
    this.microservice = microservice;
    this.microservice.uuid = uuid();
    this.microservice.createAt = Date.now();
  }


  /**
   *  Un MicroServicio necesita registrarse y notificar que se registro
   * @method register
   */

  /**
   * [runServices description]
   * @method runServices
   */

  // runServices() {
  //   const services = searchServices(this.servicesDir, this.servicesInitFile);
  //   services.forEach(__services_route__ => {
  //     console.log(__services_route__)
  //     let app = exec(`node ${__services_route__}`);
  //     app.stdout.on('data', (data) => {
  //       console.log(`${data}`);
  //     });
  //     process.on('SIGINT', function() {
  //       console.log('Finalizo el proceso')
  //     });
  //   })
  // }

}

/**
 * [searchServices description]
 * @method searchServices
 * @param  {[type]}       dir      [description]
 * @param  {[type]}       fileName [description]
 * @return {[type]}                [description]
 */

// const searchServices = (dir, fileName) => {
//   const microServices = glob.sync(`./${dir}/${fileName}`, {});
//   return microServices;
// }

module.exports = Microservices