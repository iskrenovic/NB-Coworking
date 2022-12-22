
const neo4j = require('../config/neo4j_config');
const user = require('../models/userModel');



const GetUser = async(req,res) =>{
    let uuid = req.params.id
    try { 
        let User = await neo4j.model('User').find(uuid)
        let user = {
            username : User._properties.get("username"),
            uuid :User._properties.get("uuid"),
            role :User._properties.get("role")
        }
        res.status(200).send(user)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

module.exports = {GetUser};