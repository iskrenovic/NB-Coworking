const neo4j = require('../config/neo4j_config');
const equipment = require('../models/equipmentModel');

const GetEquipment = async(req,res) =>{
    let uuid = req.params.id
    try { 
        let Equipment = await neo4j.model('Equipment').find(ID)
        let equipment = {
            type : Equipment._properties.get("type"),
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

const CreateEquipment = (req,res) => {    
    const equipmentBody = req.body    
    neo4j.model("Equipment").create({
        type: equipmentBody.type,
        description: equipmentBody.description,
        price: equipmentBody.price,
    }).then(equipment => {                        
            neo4j.cypher(`match (e:Equipment {ID: "${equipment._properties.get("ID")}"})`)
            .then(result => {                 
            })
            .catch(err => console.log(err))
       
        res.send(meal).status(200)
            
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

module.exports = {
    GetEquipment,
    CreateEquipment,
    DeleteEquipment,
    UpdateEquipment
};