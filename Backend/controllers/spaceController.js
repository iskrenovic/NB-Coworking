const neo4j = require('../config/neo4j_config');
const space = require('../models/spaceModel');

const GetSpace = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Space = await neo4j.model('Space').find(uuid)
        let space = {
            name : Space._properties.get("name"),
            address : Space._properties.get("address"),
            ID : Space._properties.get("ID"),
            contact : Space._properties.get("contact"),
        }
        res.status(200).send(space)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

/*const SpacesToJSON = (records) =>{
    let item= []    
    records.forEach(element => {
        let added = false
        item.forEach(e => {
            if (e.section == element._fields[0].properties.category){
                e.meals.push(element._fields[0].properties)   
                added = true    
            }               
        })
        if (added == false)
            item.push({section:element._fields[0].properties.category,meals:[element._fields[0].properties]})
    })
    return item
} */

const CreateSpace = (req,res) => {    
    const spaceBody = req.body    
    neo4j.model("Space").create({
        name: spaceBody.name,
        address: spaceBody.address,
        contact: spaceBody.contact,
    }).then(space => {                        
            neo4j.cypher(`match (s:Space {ID: "${space._properties.get("ID")}"})`)
            .then(result => {                 
            })
            .catch(err => console.log(err))
       
        res.send(space).status(200)
            
        })        
    .catch(err => res.send(err).status(400));
}

const DeleteSpace = async (req,res) => { 
    let spaceBody = req.body   
    try { 
        let space = await neo4j.model("Space").find(spaceBody.ID)
        if (!space) {
            return res.status(400).send("Object not found.")
        }
        space.delete()
        res.status(200).send("")
    }
    catch(e) { 
        res.status(400).end(e.message || e.toString())
    }
}

const UpdateSpace = async (req,res) => { 
    try {
        let space = await neo4j.model('Space').find(req.params.ID);
        if (!space) { 
            res.status(400).send("Couldn't find space.");
            return;
        }
        await space.update({
            contact: req.body.contact,
        });
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

/*const GetSpaceByOwnerId = (req,res) => {
    neo4j.cypher(`match (user:User {ID : "${req.params.ID}"})
    -[rel:OFFERS]->(space:Space) return space`).then(result => {
        let spaces = SpacesToJSON(result.records)    
        res.send(spaces).status(200)
    }).catch(err => console.log(err))
}*/

module.exports = {
    GetSpace,
    CreateSpace,
    DeleteSpace,
    UpdateSpace,
    GetSpaceByOwnerId
};