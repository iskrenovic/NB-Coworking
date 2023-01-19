const neo4j = require('../config/neo4j_config');

neo4j.model('Reservation',{
    dateStart: {
        type: 'date',
        required: true                
    },
    dateEnd: {
        type: 'date',
        required: true
    },
    status:{
        type:'string',
        required:true
    },
    ID:{
        type: 'uuid',
        unique: true,
        primary: true
    }   
    
});
