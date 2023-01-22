const { stringify } = require('nodemon/lib/utils');
const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config');
const place = require('../models/placeModel');

const PlacesToJSON = (records) =>{
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

function PlaceDTO(Place) { 
   
    let placeDTO = {
        price : Place._properties.get("price"),
        description : Place._properties.get("description"),
        name : Place._properties.get("name"),
        ID : Place._properties.get("ID"),
    }
    return placeDTO  
}

const GetPlace = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Place = await neo4j.model('Place').find(uuid)
        let place = PlaceDTO(Place)
        res.status(200).send(place)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const GetAllPlaces = async (req,res) => { 
    try {                
        redisData = await redis_client.get('places')
        if(redisData != null)
            res.status(200).send(JSON.parse(redisData))
        else {           
            let places = await neo4j.model('Place').all()
            let placesDTO = []
            places.forEach(element => {
                placesDTO.push(PlaceDTO(element))            
            });
            redis_client.setEx('places', 600,JSON.stringify(placesDTO))
            res.status(200).send(placesDTO)
        }    
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}

const CreatePlace = async (req,res) => {    
    const placeBody = req.body
    redisData = await redis_client.get('places')
    if(redisData!= null)
        newRedisData = JSON.parse(redisData)    
    await neo4j.model("Place").create({
        price: placeBody.price,
        name: placeBody.name,
        description: placeBody.description,
    }).then(async place => {                        
            neo4j.writeCypher(`match (p:Place {ID: "${place._properties.get("ID")}"}),(r:Room {ID: "${req.body.roomID}"}) create (r)-[rel:HASPLACES]->(p) return r,p,rel`)
            .then(result => {
                console.log(result);                 
            })
            .catch(err => console.log(err))
        let placeDTO = { 
            ID: place._properties.get('ID'),
            price: place._properties.get('price'),
            //name: place._properties.get('name'),
            //description: place._properties.get('description'),
        }
        newRedisData.push(placeDTO)
        redis_client.setEx('places',600,JSON.stringify(newRedisData))
        res.send({
            placeDTO
        }).status(200)
            
        })        
    .catch(err => res.send(err).status(400));
}

const DeletePlace = async (req,res) => { 
    let placeBody = req.body   
    try { 
        let place = await neo4j.model("Place").find(placeBody.ID)
        if (!place) {
            return res.status(400).send("Object not found.")
        }
        place.delete()
        res.status(200).send("")
    }
    catch(e) { 
        res.status(400).end(e.message || e.toString())
    }
}

const UpdatePlace = async (req,res) => { 
    try {
        let place = await neo4j.model('Place').find(req.params.ID);
        if (!place) { 
            res.status(400).send("Couldn't find place.");
            return;
        }
        await place.update({
            price: req.body.price,
            description: req.body.description
        });
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const GetPlacesByRoomId = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:Room {ID : "${req.params.ID}"}) -[:HASPLACES]->(place:Place) return place`)
    .then(result => {
        console.log(result.records);
        let places = PlacesToJSON(result.records)    
        res.send(places).status(200)
    }).catch(err => console.log(err))
}

module.exports = {
    GetPlace,
    CreatePlace,
    DeletePlace,
    UpdatePlace,
    GetPlacesByRoomId,
    GetAllPlaces
};