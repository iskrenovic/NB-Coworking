const neo4j = require('../config/neo4j_config');

neo4j.model('Room',{
    name: { 
        type: 'string',
        required: true,
    },
    floor:{
        type: 'string'
    },  
    size: {
        type: 'number'
    },
    price:{
        type:'number'
    },
    ID: {
        primary: true,
        unique: true,
        type: 'uuid'
    }
   
});