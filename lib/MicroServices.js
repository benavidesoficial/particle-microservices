import { v4 as uuid } from 'uuid';
import Messages from './Messages.js';
import glob from 'glob';
import root from 'app-root-path';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);

const searchInbox = Symbol('searchInbox');
const loadInboxes = Symbol('loadInboxes');

export default class Microservices {

  constructor() {
    this.skeleton = require(`${root}/skeleton.json`);
    this.setConfig(this.skeleton.microservice);
    this.uuid = uuid();
    this.createAt = Date.now();
    // this.ip
    // this.port
    this.messages = new Messages();

  }

  setConfig(opts = {}) {

    this.name = opts.name;
    this.description = opts.description;
    this.version = opts.version;

    // this.ip
    // this.port

  }

  sendMessages(message = {}, reply = false) {
    if (!this.messages) throw new Error('No exist config NATS')
    message.from = `${this.name.toLowerCase()}:${this.uuid}`;
    return this.messages.send(message, reply);
  }

  inbox(chanel, cb) {
    return this.messages.inbox(`${this.name.toLowerCase()}:${chanel}`, cb)
  }

  /**
   *  Un MicroServicio necesita registrarse y notificar que se registro
   * @method register
   */

  register() {
    if (!this.messages) throw new Error('No exist config NATS');

    let register = {
      to: 'microservice:register',
      // from: `${this.name.toLowerCase()}:${this.uuid}`,
      body: {
        name: this.name,
        description: this.description,
        version: this.version,
        uuid: this.uuid,
        createAt: this.createAt,
      }
    };

    // Load Inboxes
    this[loadInboxes]();
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
      require(route);
    })
  }

  [searchInbox](dir = 'inboxes', fileName = '*.js') {
    const inboxes = glob.sync(`${root}/${dir}/${fileName}`);
    return inboxes;
  }

}
