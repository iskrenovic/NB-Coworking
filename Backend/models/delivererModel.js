const neo4j = require('../config/neo4j_config');

neo4j.extend('User','Deliverer',{
    name: {
        type: 'string',
        required: true
    },
    surname: { 
        type: 'string',
        required: true
    },
    vehicle: {
        type: 'string'
    },
    avgTime : { 
        type: 'number'
    }
   
});

