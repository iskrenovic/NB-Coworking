const  neo4j  = require('../config/neo4j_config');

neo4j.extend('User','Freelancer',{
    name: {
        type: 'string',
    },
    address: {
        type: 'string',
    },   
});