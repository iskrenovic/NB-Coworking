const neo4j = require('../config/neo4j_config');

neo4j.model('Equipment',{ 
    name: { 
        type: 'string',
        required: true,
    },
    description:{
        type: 'string'
    },  
    price: {
        type: 'number',
        required: true
    },  
    ID: {
        primary: true,
        unique: true,
        type: 'uuid'
    }
    
}); 