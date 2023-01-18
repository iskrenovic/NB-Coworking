const  neo4j  = require('../config/neo4j_config');

neo4j.extend('User','Business',{
    name: {
        type: 'string',
    },
    nr_employees: {
        type: 'number',
    },     
});