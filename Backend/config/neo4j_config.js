const Neode = require ('neode');

const url = 'neo4j+s://98dc3133.databases.neo4j.io:7687';
const username = 'neo4j';
const password = 'c-mwCvesZ2pvYcHxtkGjSko-tnc0dqofp1kPmFbCjEc';

const neo4j = new Neode(url, username, password,true,'neo4j');
module.exports = neo4j;