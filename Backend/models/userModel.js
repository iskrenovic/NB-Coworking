const  neo4j  = require('../config/neo4j_config');

/*User je klasa koja je zajednicka za musteriju restoran i dostavljaca*/

neo4j.model('User', {
    username: {        
        type: 'string',
        required: true, // Creates an Exists Constraint in Enterprise mode
        unique: true
    },
    password: {
        type: 'string', // Simple schema definition of property : type
        required: true
    } , 
    role:{
        type: 'string'
    },    
    uuid: {
        primary: true,
        unique: true,
        type: 'uuid'
    },
    
});