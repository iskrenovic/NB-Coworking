const { stringify } = require('nodemon/lib/utils');
const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config');
const equipment = require('../models/equipmentModel');
//const { GetSpaceByOwnerId } = require('./spaceController');

const EquipmentToJSON = (records) =>{
    let item= []
    records.forEach(element => {
        element._fields.forEach(field=>{
            console.log(field.properties);
            item.push({
                ID: field.properties.ID,
                price: field.properties.price,    
                description: field.properties.description,
                name: field.properties.name
            })

        })
    })
    return item
} 

const GetEquipment = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Equipment = await neo4j.model('Equipment').find(uuid)
        let equipment = {
            name : Equipment._properties.get("name"),
            description : Equipment._properties.get("description"),
            ID : Equipment._properties.get("ID"),
            price : Equipment._properties.get("price"),
        }
        res.status(200).send(equipment)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const CreateEquipment = async (req,res) => {    
    const equipmentBody = req.body
    redisData = await redis_client.get('equipment')
    if(redisData!= null)
        newRedisData = JSON.parse(redisData)    
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
            ID: place._properties.get('ID'),
            price: place._properties.get('price'),
            name: place._properties.get('name'),
            description: place._properties.get('description'),
        }
        newRedisData.push(equipmentDTO)
        redis_client.setEx('equipment',600,JSON.stringify(newRedisData))
        res.send({
            equipmentDTO
        }).status(200)
            
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

const GetEquipmentBySpaceId = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:Space {ID : "${req.params.ID}"}) -[:SPACEHASEQUIP]->(equipment:Equipment) return equipment`)
    .then(result => {
        console.log(result.records);
        let equipment = EquipmentToJSON(result.records)    
        res.send(equipment).status(200)
    }).catch(err => console.log(err))
}

/*const GetEquipmentByOwnerId = (req,res) => {
    let spaces = GetSpaceByOwnerId(req.params.ID)
    let equipment= GetEquipmentBySpaceId(spaces._properties.ID)
}*/

module.exports = {
    GetEquipment,
    CreateEquipment,
    DeleteEquipment,
    UpdateEquipment,
    GetEquipmentBySpaceId
};