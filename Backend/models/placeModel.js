const neo4j = require('../config/neo4j_config');

neo4j.model('Place',{
    price: {
        type: 'number',
    },  
    ID: {
        primary: true,
        unique: true,
        type: 'uuid'
    }
   
});

