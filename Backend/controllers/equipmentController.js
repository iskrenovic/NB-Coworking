const { stringify } = require('nodemon/lib/utils');
const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config');
const { cypherLookup } = require('../helpers');
const equipment = require('../models/equipmentModel');
//const { GetSpaceByOwnerId } = require('./spaceController');

const EquipmentToJSON = (records) =>{
    let arr= []
    records.forEach(r=>{
        arr.push(EquipmentDTO(r));
    })
    return arr
}

function EquipmentDTO(Equipment) { 
   
    let equipmentDTO = {
        name : Equipment.properties.name,
        description : Equipment.properties.description,
        ID : Equipment.properties.ID,
        price : Equipment.properties.price,
    }
    return equipmentDTO  
}


const GetEquipment = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Equipment = await neo4j.model('Equipment').find(uuid)
        let equipment = EquipmentDTO(Equipment)
        res.status(200).send(equipment)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const CreateEquipment = async (req,res) => {    
    const equipmentBody = req.body
    let redisData = await redis_client.get(`GetEquipmentBySpaceId-${req.body.spaceID}`)
    let newRedisData = [];
    if(redisData)
        newRedisData = JSON.parse(redisData);
    await neo4j.model("Equipment").create({
        name: equipmentBody.name,
        description: equipmentBody.description,
        price: equipmentBody.price,
    }).then(async equipment => {                        
        neo4j.writeCypher(`match (e:Equipment {ID: "${equipment._properties.get("ID")}"}),(s:Space {ID: "${req.body.spaceID}"}) create (s)-[rel:SPACEHASEQUIP]->(e) return s,e,rel`)
            .then(result => {
                console.log(result);                 
            })
            .catch(err => console.log(err))
        let equipmentDTO = { 
            ID: equipment._properties.get('ID'),
            price: equipment._properties.get('price'),
            name: equipment._properties.get('name'),
            description: equipment._properties.get('description'),
        }
        newRedisData.push(equipmentDTO)
        redis_client.setEx(`GetEquipmentBySpaceId-${req.body.spaceID}`,600,JSON.stringify(newRedisData))
        res.status(200).send(equipmentDTO)
            
        })        
    .catch(err => res.send(err).status(400));
}

const DeleteEquipment = async (req,res) => { 
    let equipmentBody = req.body   
    try { 
        let equipment = await neo4j.model("Equipment").find(equipmentBody.ID)
        if (!equipment) {
            return res.status(400).send("Object not found.")
        }
        equipment.delete()
        res.status(200).send("")
    }
    catch(e) { 
        res.status(400).end(e.message || e.toString())
    }
}

const UpdateEquipment = async (req,res) => { 
    try {
        let equipment = await neo4j.model('Equipment').find(req.params.ID);
        if (!equipment) { 
            res.status(400).send("Couldn't find equipment.");
            return;
        }
        await equipment.update({
            description: req.body.description,
            price: req.body.price
        });
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const GetEquipmentBySpaceId = async (req,res) => {
    try {
        redisData = await redis_client.get(`GetEquipmentBySpaceId-${req.params.ID}`)
        if(redisData){
            res.status(200).send(JSON.parse(redisData))
            return;
        } 
        neo4j.cypher(`match (:Space {ID : "${req.params.ID}"}) -[:SPACEHASEQUIP]->(equipment:Equipment) return equipment`)
        .then(result => {
            let equipmentDTO = EquipmentToJSON(cypherLookup(result.records,'equipment'));
            redis_client.setEx(`GetEquipmentBySpaceId-${req.params.ID}`, 600,JSON.stringify(equipmentDTO))   
            res.status(200).send(equipmentDTO)
        }).catch(err => console.log(err))
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}

module.exports = {
    GetEquipment,
    CreateEquipment,
    DeleteEquipment,
    UpdateEquipment,
    GetEquipmentBySpaceId,
};