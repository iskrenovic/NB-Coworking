const { stringify } = require('nodemon/lib/utils');
const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config');
const { cypherLookup } = require('../helpers');
const space = require('../models/spaceModel');
//redis_client.FLUSHALL();
function SpaceDTO(Space) { 
    let spaceDTO = {
        name : Space.properties.name, 
        address : Space.properties.address,
        ID : Space.properties.ID,
        contact : Space.properties.contact,
        city : Space.properties.city
    }
    return spaceDTO  
}

const GetSpace = async(req,res) =>{
    let uuid = req.params.ID
    //console.log("ID je:", uuid);    
    try { 
        //console.log("Ja sam ovde i dajem sve od sebe");
        let Space = await neo4j.find('Space', uuid);
        //console.log("VRACENO JE", Space);
        let space = SpaceDTO(Space)
        res.status(200).send(space)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}
const SpacesToJSON = (arr) =>{
    let item= []
    arr.forEach(el=>{
        item.push(SpaceDTO(el));
    })
    return item
} 

const CreateSpace = async (req,res) => {    
    const spaceBody = req.body
    let redisData = await redis_client.get(`GetSpaceByOwnerId-${req.body.userID}`)
    let newRedisData = [];
    if(redisData)
        newRedisData = JSON.parse(redisData)    
    await neo4j.model("Space").create({
        name: spaceBody.name,
        address: spaceBody.address,
        contact: spaceBody.contact,
        city: spaceBody.city,
    }).then(async space => {
            neo4j.writeCypher(`match (s:Space {ID: "${space._properties.get("ID")}"}),(u:User {ID: "${req.body.userID}"}) create (u)-[rel:OWNER]->(s) return u,s,rel`)
            .then(result => { 
            })
            .catch(err => console.log(err))
        let spaceDTO = { 
            ID: space._properties.get('ID'),
            name:space._properties.get('name'),
            address:space._properties.get('address'),
            contact : space._properties.get('contact'),
            city : space._properties.get('contact')
        }
        newRedisData.push(spaceDTO);
        redis_client.setEx(`GetSpaceByOwnerId-${req.body.userID}`,600,JSON.stringify(newRedisData))
        res.status(200).send(spaceDTO);
            
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

const GetSpaceByOwnerId = async (req,res) => {
    try {
        redisData = await redis_client.get(`GetSpaceByOwnerId-${req.params.ID}`)
        if(redisData){
            console.log(JSON.parse(redisData));
            res.status(200).send(JSON.parse(redisData))
            return;
        }        
        neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:OWNER]->(space:Space) return space`).then(result => {
            let spacesDTO = SpacesToJSON(cypherLookup(result.records,'space'));
            redis_client.setEx(`GetSpaceByOwnerId-${req.params.ID}`, 600,JSON.stringify(spacesDTO)) 
            
            res.status(200).send(spacesDTO);
        }).catch(err => console.log(err))
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}

const Get10Spaces =  async(req,res) => {
    try{
        redisData = await redis_client.get(`Get10Spaces`)
        if(redisData != null)
        {
            res.status(200).send(JSON.parse(redisData))
            return;
        }
        let spaces = await neo4j.cypher(`Match (s:Space ) return s limit 10`);
        let spacesDTO = SpacesToJSON(cypherLookup(spaces.records,'s'));
        redis_client.setEx(`Get10Spaces`, 600,JSON.stringify(spacesDTO)) 
        res.status(200).send(spacesDTO); 
    }
    catch(err){
        console.log(err);
    }
}

const GetSpacesByCity =  async(req,res) => {
    try{
        redisData = await redis_client.get(`GetSpacesByCity-${req.params.city}`)
        if(redisData != null)
        {
            res.status(200).send(JSON.parse(redisData))
            return;
        }
        let spaces = await neo4j.cypher(`Match (s:Space {city: "${req.params.city}"}) return s`);
        let spacesDTO = SpacesToJSON(cypherLookup(spaces.records,'s'));
        redis_client.setEx(`GetSpacesByCity-${req.params.city}`, 600,JSON.stringify(spacesDTO)) 
        res.status(200).send(spacesDTO); 
    }
    catch(err){
        console.log(err);
    }
}

const GetRecommendedSpacesFreelancer =  async(req,res) => {
    try{
        redisData = await redis_client.get(`GetRecommendedSpacesFreelancer-${req.params.ID}${req.params.city}`)
        if(redisData != null)
        {
            res.status(200).send(JSON.parse(redisData))
            return;
        }
        let neoResponce = await neo4j.cypher(`Match (:Freelancer {ID: "${req.params.ID}"})-[:FRENT]->(:Reservation{status:"accepted"})<-[:RENTPLACE]-(p1:Place), (s:Space {city:"${req.params.city}"})-[:HASROOMS]->(:Room)-[:HASPLACES]->(p2:Place) where p2.price < p1.price * 1.1 and p2.price > p1.price * 0.9 return distinct s limit 25`)
        let spacesDTO = SpacesToJSON(cypherLookup(neoResponce.records,'s'));
        redis_client.setEx(`GetRecommendedSpacesFreelancer-${req.params.ID}${req.params.city}`, 600,JSON.stringify(spacesDTO)) 
        res.status(200).send(spacesDTO); 
    }
    catch(err){
        console.error(err);
    }
}

const GetRecommendedSpacesBusiness =  async(req,res) => {
    try{
        redisData = await redis_client.get(`GetRecommendedSpacesBusiness-${req.params.ID}${req.params.city}`)
        if(redisData != null)
        {
            res.status(200).send(JSON.parse(redisData))
            return
        }
        let neoResponce = await neo4j.cypher(`Match (:Business {ID: "${req.params.ID}"})-[:BRENT]->(:Reservation)<-[:RENTROOM]-(r1:Room), (s:Space {city:"${req.params.city}"})-[:HASROOMS]->(r2:Room) where r2.price < r1.price * 1.1 and r2.price > r1.price * 0.9 return distinct s limit 25`)
        let spacesDTO = SpacesToJSON(cypherLookup(neoResponce.records,'s'));

        redis_client.setEx(`GetRecommendedSpacesBusiness-${req.params.ID}${req.params.city}`, 600,JSON.stringify(spacesDTO))
        res.status(200).send(spacesDTO); 
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
    GetRecommendedSpacesBusiness,
    Get10Spaces
};