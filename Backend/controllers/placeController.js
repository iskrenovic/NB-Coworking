const neo4j = require('../config/neo4j_config');
const place = require('../models/placeModel');

const PlacesToJSON = (records) =>{
    let item= []
    records.forEach(element => {
        element._fields.forEach(field=>{
            console.log(field.properties);
            item.push({
                ID: field.properties.ID,
                price :field.properties.price    
            })

        })
    })
    return item
} 

const GetPlace = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Place = await neo4j.model('Place').find(uuid)
        let place = {
            price : Place._properties.get("price"),
            ID : Place._properties.get("ID"),
        }
        res.status(200).send(place)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const CreatePlace = async (req,res) => {    
    const placeBody = req.body    
    await neo4j.model("Place").create({
        price: placeBody.price,
    }).then(async place => {                        
            neo4j.writeCypher(`match (p:Place {ID: "${place._properties.get("ID")}"}),(r:Room {ID: "${req.body.roomID}"}) create (r)-[rel:HASPLACES]->(p) return r,p,rel`)
            .then(result => {
                console.log(result);                 
            })
            .catch(err => console.log(err))
       
        res.send({
            ID: place._properties.get('ID'),
            price: place._properties.get('price'),
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
            price: req.body.price
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
    GetPlacesByRoomId
};