const neo4j = require('../config/neo4j_config');

neo4j.model('Place',{
    price: {
        type: 'number',
    },
    description:{
        type: 'string'
    },
    name:{
        type: 'string'
    },  
    ID: {
        primary: true,
        unique: true,
        type: 'uuid'
    },
   
});

