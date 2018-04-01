const glob = require("glob");
const exec = require('child_process').exec;
const mergePkg = require('merge-pkg');
const fs = require('fs');
const express = require('express'),
  app = express();

class MicroServices {

  constructor() {
    this.nameService = null;
    this.servicesDir = null;
    this.servicesInitFile = null;
  }

  /**
   * Metodo encargado de disparar el servidor
   * @method listen
   * @param  {[String]}   port Puerto donde correra la aplicacion
   * @param  {Function} cb   [description]
   * @return {[type]}        [description]
   */
  listen(port, cb) {
    app.listen(port, cb)
  }
  /**
   *
   * @method setRouteServices
   * @param  {String}         dir      [description]
   * @param  {String}         fileName [description]
   */

  setRouteServices(dir, fileName) {
    this.servicesDir = dir;
    this.servicesInitFile = fileName;
  }

  /**
   *  Un MicroServicio necesita registrarse
   * @method register
   */

  register() {

  }

  /**
   * [runServices description]
   * @method runServices
   */

  runServices() {
    const services = searchServices(this.servicesDir, this.servicesInitFile);
    services.forEach(__services_route__ => {
      console.log(__services_route__)
      let app = exec(`node ${__services_route__}`);
      app.stdout.on('data', (data) => {
        console.log(`${data}`);
      });
      process.on('SIGINT', function() {
        console.log('Finalizo el proceso')
      });
    })
  }

  static manualPackageMerge(from) {
    var dst = fs.readFileSync(`${from}/package.json`, 'utf8');
    var src = fs.readFileSync('./package.json', 'utf8');
    const merged = mergePkg(JSON.parse(dst), JSON.parse(src));
    fs.writeFileSync('./package.b.json', JSON.stringify(merged, null, 4));
  }
}

/**
 * [searchServices description]
 * @method searchServices
 * @param  {[type]}       dir      [description]
 * @param  {[type]}       fileName [description]
 * @return {[type]}                [description]
 */

const searchServices = (dir, fileName) => {
  const microServices = glob.sync(`./${dir}/${fileName}`, {});
  return microServices;
}

module.exports = MicroServices