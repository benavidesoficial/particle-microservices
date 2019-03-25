const uuid = require('uuid/v4'),
  client = redis.createClient();

class Messages {

  constructor() {

  }

  createMessages(message = {}) {

    // Object.keys(message).forEach(key => {
    //   console.log(key)
    // });

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
    //
    // }
    return message;
  }

  // sendMessages(message) {
  //   let microservice = message.to.split(':')[0];
  //   client.lpush([microservice, JSON.stringify(message)]);
  // }

}
//
// let messages = new Messages();
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