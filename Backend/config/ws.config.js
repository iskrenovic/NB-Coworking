const redis_client = require('./redis_config')
const WebSocket = require('ws')


const WEB_SOCKET_PORT_USER = 3300;

const serverUser = new WebSocket.Server({ port : WEB_SOCKET_PORT_USER });
var redisUserClient = redis_client.duplicate();
redisUserClient.connect();

serverUser.on('connection',  async function connection(ws) {
    ws.on('message', async (data)=>{
        let response = JSON.parse(data)
        console.log("PRIJAVLJEN", response);
        if(response.init){
            ws.id = response.ID;
        }
    })
});


redisUserClient.SUBSCRIBE('app:user',(message)=>{
    let msg = JSON.parse(message);
    serverUser.clients.forEach(client=>{
        if(client.id == msg.destination)
            client.send(JSON.stringify(message));
    })
})

module.exports = redis_client;