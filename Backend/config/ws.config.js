const redis_client = require('./redis_config')
const WebSocket = require('ws')


const WEB_SOCKET_PORT_CUSTOMER = 3000;
const WEB_SOCKET_PORT_DELIVERER = 3001;
const WEB_SOCKET_PORT_STORE = 3002;

const serverCustomer = new WebSocket.Server({ port : WEB_SOCKET_PORT_CUSTOMER });
const serverDeliverer = new WebSocket.Server({ port : WEB_SOCKET_PORT_DELIVERER });
const serverStore = new WebSocket.Server({ port : WEB_SOCKET_PORT_STORE });


// // Register event for client connection
serverCustomer.on('connection', async function connection(ws) {
//   // broadcast on web socket when receving a Redis PUB/SUB Event
  var redisCustomer = redis_client.duplicate();
  await redisCustomer.connect();
  redisCustomer.subscribe('app:customer',  (message) => { 
    ws.send(message)
  });
    

});

serverDeliverer.on('connection',  async function connection(ws) {

//   // broadcast on web socket when receving a Redis PUB/SUB Event
  var redisDeliverer = redis_client.duplicate();
  await redisDeliverer.connect();
  redisDeliverer.subscribe('app:deliverer', message => { 
    ws.send(message)
  });

});

serverStore.on('connection', async  function connection(ws) {
//   // broadcast on web socket when receving a Redis PUB/SUB Event
  var redisStore = redis_client.duplicate();
  await redisStore.connect();
  redisStore.subscribe('app:store', message => { 
    ws.send(message)
  });
    
});

module.exports = redis_client;