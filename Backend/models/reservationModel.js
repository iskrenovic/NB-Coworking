const neo4j = require('../config/neo4j_config');

neo4j.model('Reservation',{
    dateStart: {
        type: 'number',
        required: true                
    },
    dateEnd: {
        type: 'number',
        required: true
    },
    ID:{
        type: 'uuid',
        unique: true,
        primary: true
    }   
    
});
