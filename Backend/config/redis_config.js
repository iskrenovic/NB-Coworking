const redis = require('redis');


const REDIS_SERVER = "redis://localhost:6379"


const redis_client = redis.createClient(REDIS_SERVER);

        
;(async () => { 
    redis_client.on('ready',() => console.log('Redis is ready.'));
    redis_client.on('error',(err) => console.log('Redis Client Error',err));
    await redis_client.connect();
})();






module.exports = redis_client;