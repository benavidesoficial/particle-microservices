const uuid = require('uuid/v4'),
  redis = require("redis");
const Redis = require('ioredis');

// const glob = require("glob");
// const exec = require('child_process').exec;
// const mergePkg = require('merge-pkg');
// const fs = require('fs');

class Microservices {

  constructor() {

    this.microservice = {};

    this.redis = new Redis({
      port: 14233,
      host: 'redis-14233.c62.us-east-1-4.ec2.cloud.redislabs.com',
      password: 'Mebpx563412'
    });

    // this.pub = new Redis({
    //   port: 18492,
    //   host: 'redis-18492.c114.us-east-1-4.ec2.cloud.redislabs.com',
    //   password: 'Mebpx563412'
    // });
    // this.sub = new Redis({
    //   port: 18492,
    //   host: 'redis-18492.c114.us-east-1-4.ec2.cloud.redislabs.com',
    //   password: 'Mebpx563412'
    // });

    this.nameService = null;
    this.servicesDir = null;
    this.servicesInitFile = null;
    // this.express = app;
  }

  setConfig(microservice) {
    this.microservice = microservice;
    this.microservice.uuid = uuid();
    this.microservice.createAt = Date.now();
  }

  connect() {
    this.redis.on('connect', () => {
      this._register(this.microservice);
    });
  }

  /**
   * @method setRouteServices
   * @param  {String}         dir      [description]
   * @param  {String}         fileName [description]
   */

  setRouteServices(dir, fileName) {
    this.servicesDir = dir;
    this.servicesInitFile = fileName;
  }

  on(chanel, cb) {

  }

  /**
   *  Un MicroServicio necesita registrarse y notificar que se registro
   * @method register
   */

  _register(microservice) {
    // Agregamos el UUID a la coleccion de microservicios disponibles
    this.redis.lpush(["microservices", microservice.uuid]);
    // Agregamos al Microservicio como un objecto en Redis
    this.redis.hset(microservice.uuid, this._toRedis(microservice));
    // Enviamos la notificacion del Registro
    this.redis.publish('monitor:register', JSON.stringify(microservice));
  }

  _toRedis(micro) {
    delete micro.uuid;
    let values = []
    Object.keys(micro).forEach(key => {
      values.push(`${micro[key]} ${key}`)
    });
    return values;
  }

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