
const neo4j = require('../config/neo4j_config');
const deliverer = require('../models/delivererModel');
const token = require('../config/token')
const bcrypt = require('bcrypt');
const {RecordsToJSON,NodeTOString, NodeToJson} = require('../helpers')
const vehicleAvgTime = require('../vehicleTime');

const saltRounds = 10;
const CreateDeliverer = (req,res) => {
    bcrypt.hash(req.body.password, saltRounds).then(hash => {
            neo4j.model("Deliverer").create({
            name: req.body.name,  
            surname: req.body.surname,
            vehicle: req.body.vehicle,
            avgTime: vehicleAvgTime[req.body.vehicle],
            username: req.body.username,
            password: hash,
            role: "Deliverer"// Simple schema definition of property : type
        
        }).then(deliverer => {

            let user = {
                username : deliverer._properties.get("username"),
                uuid :deliverer._properties.get("uuid"),
                role :deliverer._properties.get("role")
            }
            webtoken = token.generateAccessToken(user)
            res.send({user,webtoken}).status(200)  

        }).catch(err => res.status(400).send(err))

    }).catch(err => res.status(500).send(err))
    
}

const GetDelivererByID = async (req,res) => { 
    try {
        let deliverer = await neo4j.model('Deliverer').find(req.params.id);
        if (!deliverer) { 
            res.status(400).send("Couldn't find deliverer.");
            return;
        }

        let delivererJson = NodeToJson(deliverer);
        console.log(delivererJson);
        res.status(200).send(delivererJson);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
}

const ChangeVehicle = async (req,res) => { 
    try {
        let deliverer = await neo4j.model('Deliverer').find(req.params.id);
        if (!deliverer) { 
            res.status(400).send("Couldn't find deliverer.");
            return;
        }
        await deliverer.update({
            avgTime: vehicleAvgTime[req.body.vehicle],
            vehicle: req.body.vehicle
        });
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}
 
module.exports = {CreateDeliverer, GetDelivererByID, ChangeVehicle};