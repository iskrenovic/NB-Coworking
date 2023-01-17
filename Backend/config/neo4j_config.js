const Neode = require ('neode');

const url = 'bolt://localhost:7687';
const username = 'neo4j';
const password = 'sifrazabazu321';

const neo4j = new Neode(url, username, password,true,'neo4j');
module.exports = neo4j;