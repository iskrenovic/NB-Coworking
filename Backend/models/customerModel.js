const  neo4j  = require('../config/neo4j_config');


neo4j.extend('User','Customer',{
    name: {
        type: 'string',
        required: true
    },
    surname: {
        type: 'string',
        required: true
    },
    location: {
        type: 'string'
    },
   
    
});