const uuid = require('uuid/v4');
const Messages = require('./Messages');
const glob = require("glob");
// const exec = require('child_process').exec;
// const mergePkg = require('merge-pkg');
// const fs = require('fs');

const searchInbox = Symbol('searchInbox');
const loadInboxes = Symbol('loadInboxes');

class Microservices {

  constructor() {

    // this.name = opts.name;
    // this.description = opts.description;
    // this.version = opts.version || '0.0.1';
    // this.uuid = uuid();
    // this.createAt = Date.now();
    // this.messages = new Messages(opts.nats);
    // this.ip
    // this.port

  }

  setConfig(opts = {}) {

    this.name = opts.name;
    this.description = opts.description;
    this.version = opts.version || '0.0.1';
    this.uuid = uuid();
    this.createAt = Date.now();
    if (opts.nats)
      this.messages = new Messages(opts.nats);
    // this.ip
    // this.port

  }

  sendMessages(message = {}, reply = false) {
    if (!this.messages) throw new Error('No exist config NATS')
    message.from = `${this.name.toLowerCase()}:${this.uuid}`;
    return this.messages.send(message, reply);
  }

  inbox(chanel, cb) {
    // console.log(chanel)
    return this.messages.inbox(`${this.name.toLowerCase()}:${chanel}`, cb)
  }

  /**
   *  Un MicroServicio necesita registrarse y notificar que se registro
   * @method register
   */

  register() {
    if (!this.messages) throw new Error('No exist config NATS');

    let register = {
      to: 'gateway:discovery',
      // from: `${this.name.toLowerCase()}:${this.uuid}`,
      body: {
        name: this.name,
        description: this.description,
        version: this.version,
        uuid: this.uuid,
        createAt: this.createAt,
      }
    };

    // this.inbox(`${this.name.toLowerCase()}`, (message) => {
    //
    //   console.log(message);
    //
    // })
    this[loadInboxes]()
    this.sendMessages(register);
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

  [loadInboxes]() {
    const inboxes = this[searchInbox]();
    inboxes.forEach((route) => {
      require(route)
    })
  }

  [searchInbox](dir = 'inboxes', fileName = '*.js') {
    const inboxes = glob.sync(`./${dir}/${fileName}`, {
      realpath: true,
    });
    return inboxes;
  }

}

module.exports = Microservices