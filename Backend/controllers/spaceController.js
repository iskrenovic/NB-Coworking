const { stringify } = require('nodemon/lib/utils');
const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config');
const space = require('../models/spaceModel');

function SpaceDTO(Space) { 
   
    let spaceDTO = {
        name : Space._properties.get("name"), 
        address : Space._properties.get("address"),
        ID : Space._properties.get("ID"),
        contact : Space._properties.get("contact"),
        city : Space._properties.get("city")
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

/*const GetAllSpaces = async (req,res) => { 
    try {                
        redisData = await redis_client.get('spaces')
        if(redisData != null)
            res.status(200).send(JSON.parse(redisData))
        else {           
            let spaces = await neo4j.model('Space').all()
            let spacesDTO = []
            spaces.forEach(element => {
                spacesDTO.push(SpaceDTO(element))            
            });
            redis_client.setEx('spaces', 600,JSON.stringify(spacesDTO))
            res.status(200).send(spacesDTO)
        }    
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}*/

const RecordsToJSON = (records) =>{
    let item= []    
    records.forEach(element => {     
        console.log(element._fields[0]);  
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
    redisData = await redis_client.get('spaces')
    if(redisData!= null)
        newRedisData = JSON.parse(redisData)    
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
        let spaceDTO = { 
            ID: space._properties.get('ID'),
            name:space._properties.get('name'),
            address:space._properties.get('address')
        }
        newRedisData.push(spaceDTO)
        redis_client.setEx('spaces',600,JSON.stringify(newRedisData))
        res.send({
            spaceDTO 
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

const GetSpaceByOwnerId = async (req,res) => {
    try {
        redisData = await redis_client.get(`GetSpaceByOwnerId-${req.params.ID}`)
        if(redisData){
            res.status(200).send(JSON.parse(redisData))
            return;
        }        
        neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:OWNER]->(space:Space) return space`).then(result => {
            console.log(result.records);
            let spaces = SpacesToJSON(result.records)
            let spacesDTO = [] 
            result.forEach(element => {
                spacesDTO.push(SpaceDTO(element))            
            })
            redis_client.setEx(`GetSpaceByOwnerId-${req.params.ID}`, 600,JSON.stringify(spacesDTO)) 
            res.send(spaces).status(200)
        }).catch(err => console.log(err))
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}

const GetSpacesByCity =  async(req,res) => {
    try{
        redisData = await redis_client.get(`GetSpacesByCity-${req.params.city}`)
        if(redisData != null)
        {
            res.status(200).send(JSON.parse(redisData))
            return
        }
        let spaces = await neo4j.cypher(`Match (s:Space {city: "${req.params.city}"}) return s`);
        let spacesDTO = [] 
        spaces.forEach(element => {
            spacesDTO.push(SpaceDTO(element))            
        })
        redis_client.setEx(`GetSpacesByCity-${req.params.city}`, 600,JSON.stringify(spacesDTO)) 
        res.status(200).send(RecordsToJSON(spaces.records)); 
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
            return
        }
        let neoResponce = await neo4j.cypher(`Match (:Freelancer {ID: "${req.params.ID}"})-[:FRENT]->(:Reservation{status:"accepted"})<-[:RENTPLACE]-(p1:Place), (s:Space {city:"${req.params.city}"})-[:HASROOMS]->(:Room)-[:HASPLACES]->(p2:Place) where p2.price < p1.price * 1.1 and p2.price > p1.price * 0.9 return distinct s limit 25`)
        let spacesDTO = [] 
        neoResponce.forEach(element => {
            spacesDTO.push(SpaceDTO(element))            
        })
        redis_client.setEx(`GetRecommendedSpacesFreelancer-${req.params.ID}${req.params.city}`, 600,JSON.stringify(spacesDTO)) 
        res.status(200).send(RecordsToJSON(neoResponce.records)); 
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
        let spacesDTO = [] 
        neoResponce.forEach(element => {
            spacesDTO.push(SpaceDTO(element))            
        })
        redis_client.setEx(`GetRecommendedSpacesBusiness-${req.params.ID}${req.params.city}`, 600,JSON.stringify(spacesDTO))
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
    GetRecommendedSpacesBusiness,
};