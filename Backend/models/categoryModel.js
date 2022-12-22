const  neo4j  = require('../config/neo4j_config');

neo4j.model('Category', {
    name: { 
        type: 'string',
        required: true,
        primary: true
    }
    
});