const  neo4j  = require('../config/neo4j_config');

neo4j.model('Space', {
    name: { 
        type: 'string',
        required: true,
    },
    address:{
        type: 'string'
    },
    contact:{
        type: 'string'
    },
    city:{
        type: 'string',
        required: true,
    },   
    ID: {
        primary: true,
        unique: true,
        type: 'uuid'
    }
    
});