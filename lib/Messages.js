const uuid = require('uuid/v4');
// crypto = require('crypto');
const NATS = require('nats');

class Messages {

  constructor(config = {}) {
    this.nats = NATS.connect(config);
  }

  createMessages(message = {}) {
    message.mid = uuid();
    message.timestamp = Date.now();
    if (!message.mid) throw new Error('Not found "mid"');
    if (!message.timestamp) throw new Error('Not found "timestamp"');
    if (!message.from) throw new Error('Not found "from"');
    if (!message.to) throw new Error('Not found "to"');
    if (!message.body) throw new Error('Not found "body"');

    // let message = {
    //   mid: uuid(),
    //   rmid: '', //Optionsl
    //   to: 'microservice:uuid',
    //   forward: '', //Optinals
    //   from: '',
    //   type: '', // optional
    //   priority: '', // optional
    //   timestamp: '',
    //   ttl: '', // Optional
    //   body: {},
    //   authorization: '', // Optional
    //   signature: ''
    // }

    return message;
  }

  send(message) {
    this.nats.publish(message.to, message);
  }

  setConfig(config = {}) {

  }

  inbox() {
    console.log('inbox')
    this.nats.subscribe('system:discovery', (message) => {
      console.log('SYSTEM:DISCOVERY', message)
    })
  }

}
//
// let messages = new Messages({
//   url: 'nats://172.16.203.200:4222',
//   json: true
// });
//
// messages.inbox();
//
// let authMessage = {
//   to: 'auth:login',
//   from: 'gateway:id',
//   body: {
//     username: "miguel",
//     password: "miguel"
//   }
// };
//
// let authVerificationMessage = {
//   to: 'auth:verification',
//   from: 'gateway:id',
//   authorization: 'bjh23b123bh4g1j2i34hi',
//   body: {}
// };
//
// messages.sendMessages(messages.createMessages(authMessage));
// messages.sendMessages(messages.createMessages(authVerificationMessage));

module.exports = Messages;