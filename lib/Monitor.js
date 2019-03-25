const uuid = require('uuid/v4');
const Redis = require('ioredis');


class Monitor {

  constructor(config) {

    this.discoverTimer = 1000;
    this.discoverInterval = '';
    this.microservices = null;

    this.redis = new Redis({
      port: 18492,
      host: 'redis-18492.c114.us-east-1-4.ec2.cloud.redislabs.com',
      password: 'Mebpx563412'
    });

    this.sub = new Redis({
      port: 18492,
      host: 'redis-18492.c114.us-east-1-4.ec2.cloud.redislabs.com',
      password: 'Mebpx563412'
    });

  }

  /**
   * Metodo que descubre los microservicios disponibles
   * @method discover
   * @return {[type]} [description]
   */

  discover() {
    this._getMicroservices();

    console.log('Microservicios disponibles', this.microservices);

    this.on('register:microservices', (chanel, message) => {
      this._getMicroservices();
      console.log('Nuevo microservicios registrado', message)
    });

  }

  on(chanel, cb = null) {
    this.sub.subscribe(chanel)
    this.sub.on('message', cb)
  }

  _getMicroservices() {
    this.redis.lrange('microservices', 0, -1, (err, microservices) => {
      this.microservices = microservices;
    });
  }



}

module.exports = Monitor;