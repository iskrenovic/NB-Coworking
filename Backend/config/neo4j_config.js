const Neode = require ('neode');

const url = 'neo4j+s://6cf7224b.databases.neo4j.io'; //
const username = 'neo4j';
const password = '8wmfW5Lsud5Lr1FUsfFRL9Jf_5zCCKkVbloBVGBU5AY'; //


const neo4j = new Neode(url, username, password,true,'neo4j');
module.exports = neo4j;