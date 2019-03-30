const uuid = require('uuid/v4'),
  Redis = require('ioredis'),
  Ping = require('ping'),
  isReachable = require('is-reachable');

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

  async discover() {
    await this._getMicroservices();
    this.watchDog()
  }

  /**
   * Metodo encargado de verificar los microservicios cada x's tiempo
   * @method watchDog
   * @param  {Number} [interval=1000] [description]
   * @return {[type]}                 [description]
   */

  watchDog(interval = 1000) {
    // Cada cuanto se van a verificar los microservicios
    setInterval(() => {
      if (this.microservices.length) {
        // Recorremos todos los Microservicios
        this.microservices.forEach(micro => {
          // Obtenemos todos los atributos del microservicio
          this.redis.hgetall(micro, (err, microserviceAttributes) => {
            // Verificamos que exista la ip en los microservicios
            if (microserviceAttributes.ip) {
              // Hacemos ping al microservicio
              isReachable(microserviceAttributes.ip)
                .then((err, status) => {
                  console.log(err)
                  console.log(status)
                })
              // Ping.sys.probe(microserviceAttributes.ip, (isAlive) => {
              //   // Si no esta vivo, lo removemos
              //   if (!isAlive) this._remove(micro);
              //   console.log('Disponibilidad del microservicio', microserviceAttributes.name, isAlive)
              // }, {
              //   min_reply: 4
              // });
            } else {
              this._remove(micro);
            }

          });

        });
      } else {
        console.log('No existe ningun microservicio registrado')
      }


    }, interval);

  }

  on(channel, cb = null) {
    let redis = new Redis(this.config.redis);
    redis.subscribe(channel);
    redis.on('message', cb);
  }

  _remove(micro) {
    // Removemos  el microservicios de la lista de microservicios registrados
    this.redis.lrem('microservices', -1, micro, () => {
      // Notificamos que fue removido
      this.redis.publish('monitor:remove', micro);
    });
    // Eliminar microsevicio y sus atributos
    this.redis.del(micro);
  }

  _getMicroservices() {
    return new Promise((resolve, reject) => {
      let redis = new Redis(this.config.redis);
      redis.lrange('microservices', 0, -1, (err, microservices) => {
        if (err) reject(err);
        this.microservices = microservices;
        console.log('[GET] Microservices', this.microservices);
        // console.log('Microservicios disponibles', microservices);
        redis.quit();
        redis = null;
        resolve(this.microservices)
      });
    });

  }

}

module.exports = new Monitor();