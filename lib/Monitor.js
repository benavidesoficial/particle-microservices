const uuid = require('uuid/v4'),
  Redis = require('ioredis'),
  Ping = require('ping');


class Monitor {

  constructor() {

    this.config = {};
    this.discoverTimer = 1000;
    this.discoverInterval = '';
    this.microservices = [];

    this.redis = '';


    // this.redis = new Redis({
    //   port: 18492,
    //   host: 'redis-18492.c114.us-east-1-4.ec2.cloud.redislabs.com',
    //   password: 'Mebpx563412'
    // });

    // this.sub = new Redis({
    //   port: 18492,
    //   host: 'redis-18492.c114.us-east-1-4.ec2.cloud.redislabs.com',
    //   password: 'Mebpx563412'
    // });

  }

  setContig(config = {}) {
    this.config = config;
    this.redis = new Redis(this.config.redis);
  }

  /**
   * Metodo que descubre los microservicios disponibles
   * @method discover
   * @return {[type]} [description]
   */

  discover() {
    this._getMicroservices();
    // this.on('monitor:register', (chanel, message) => {
    //   this._getMicroservices();
    //   console.log('Nuevo microservicios registrado', message)
    // });
  }

  watchDog(interval = 1000) {

    // setInterval(() => {
    //   this.microservices.forEach(micro => {
    //     if (micro.ip) {
    //       Ping.sys.probe(micro.ip, (isAlive) => {
    //         console.log(isAlive);
    //       });
    //     }
    //     // console.log(micro);
    //   });
    // }, interval);

    // setInterval(() => {
    //   this.microservices.forEach(micro => {
    //     Ping.sys.probe(micro.ip, (isAlive) => {
    //       console.log(isAlive);
    //     })
    //   })
    // }, interval)

  }

  on(channel, cb = null) {
    let redis = new Redis(this.config.redis);
    redis.subscribe(channel)
    redis.on('message', cb)
  }

  _getMicroservices() {
    this.redis.lrange('microservices', 0, -1, (err, microservices) => {
      this.microservices = microservices;
      console.log('Microservicios disponibles', this.microservices);
    });
  }

}

module.exports = new Monitor();