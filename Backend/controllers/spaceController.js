const neo4j = require('../config/neo4j_config');
const space = require('../models/spaceModel');

const GetSpace = async(req,res) =>{
    let uuid = req.params.ID
    //console.log("ID je:", uuid);    
    try { 
        //console.log("Ja sam ovde i dajem sve od sebe");
        let Space = await neo4j.find('Space', uuid);
        //console.log("VRACENO JE", Space);
        let space = {
            name : Space._properties.get("name"), 
            address : Space._properties.get("address"),
            ID : Space._properties.get("ID"),
            contact : Space._properties.get("contact"),
            city : Space._properties.get("city")
        }
        res.status(200).send(space)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const RecordsToJSON = (records) =>{
    let item= []    
    records.forEach(element => {       
        item.push(element._fields[0].properties)
    })
    return item
} 

const SpacesToJSON = (records) =>{
    let item= []
    records.forEach(element => {
        element._fields.forEach(field=>{
            console.log(field.properties);
            item.push({
                ID: field.properties.ID,
                name:field.properties.name,
                address:field.properties.address      
            })

        })
    })
    return item
} 

const CreateSpace = async (req,res) => {    
    const spaceBody = req.body    
    await neo4j.model("Space").create({
        name: spaceBody.name,
        address: spaceBody.address,
        contact: spaceBody.contact,
        city: spaceBody.city,
    }).then(async space => {
            neo4j.writeCypher(`match (s:Space {ID: "${space._properties.get("ID")}"}),(u:User {ID: "${req.body.userID}"}) create (u)-[rel:OWNER]->(s) return u,s,rel`)
            .then(result => { 
                console.log(result);                
            })
            .catch(err => console.log(err))
       
        res.send({
            ID: space._properties.get('ID'),
            name:space._properties.get('name'),
            address:space._properties.get('address') 
        }).status(200)
            
        })        
    .catch(err => res.send(err).status(400));
}

const DeleteSpace = async (req,res) => { 
    try { 
        let result = await neo4j.model('Space').find(req.params.ID);
        if (!result) {
            return res.status(400).send("Object not found.")
        }
        await result.delete();
        res.status(200).send("DELETE COMPLETE")
    }
    catch(e) { 
        console.error(e.message);
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

const GetSpaceByOwnerId = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:OWNER]->(space:Space) return space`).then(result => {
        console.log(result.records);
        let spaces = SpacesToJSON(result.records)    
        res.send(spaces).status(200)
    }).catch(err => console.log(err))
}

const GetSpacesByCity =  async(req,res) => {
    neo4j.find('Space', {city : req.params.city}).then(space => {
        res.status(200).send(RecordsToJSON(space.records)); 
    }).catch(err => {console.log(err); return "ERROR!"})
}

const GetRecommendedSpacesFreelancer =  async(req,res) => {
    try{
    let neoResponce = await neo4j.cypher(`Match (:Freelancer {ID: "${req.params.ID}"})-[:FRENT]->(:Reservation)<-[:RENTPLACE]-(p1:Place), (s:Space {city:${req.paras.city}})-[:HASROOMS]->(:Room)-[:HASPLACES]->(p2:Place) where p2.price < p1.price * 1.1 and p2.price > p1.price * 0.9 return s limit 25`)
    res.status(200).send(RecordsToJSON(neoResponce.records)); 
    }
    catch(err){
        console.error(err);
    }
}

const GetRecommendedSpacesBusiness =  async(req,res) => {
    try{
    let neoResponce = await neo4j.cypher(`Match (:Business {ID: "${req.params.ID}"})-[:BRENT]->(:Reservation)<-[:RENTROOM]-(r1:Room), (s:Space {city:${req.paras.city}})-[:HASROOMS]->(r2:Room) where r2.price < r1.price * 1.1 and r2.price > r1.price * 0.9 return s limit 25`)
    res.status(200).send(RecordsToJSON(neoResponce.records)); 
    }
    catch(err){
        console.error(err);
    }
}

module.exports = {
    GetSpace,
    CreateSpace,
    DeleteSpace,
    UpdateSpace,
    GetSpaceByOwnerId,
    GetSpacesByCity,
    GetRecommendedSpacesFreelancer,
    GetRecommendedSpacesBusiness
};