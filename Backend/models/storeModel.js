const neo4j = require('../config/neo4j_config');

neo4j.extend('User','Store',{
    name: {
        type: 'string',
        required: true
    },
    location: { 
        type: 'string',
        required: true,
        unique: true
    },
    preptime:{
        type: 'number'
    }
   
});