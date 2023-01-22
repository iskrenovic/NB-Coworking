const { stringify } = require('nodemon/lib/utils');
const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config');
const { cypherLookup } = require('../helpers');
const room = require('../models/roomModel');


const RoomsToJSON = (records) =>{
    let arr= []
    records.forEach(r=>{
        arr.push(RoomDTO(r));
    })
    return arr
}

function RoomDTO(Room) {
    console.log("SOBA", Room);  
    let roomDTO = {
        name : Room.properties.name,
        floor : Room.properties.floor,
        ID : Room.properties.ID,
        size : Room.properties.size,
        price: Room.properties.price
    }
    return roomDTO  
}

const GetRoom = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Room = await neo4j.model('Room').find(uuid)
        let room = RoomDTO(Room)
        res.status(200).send(room)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}
//Kreira novu Sobu
const CreateRoom = async (req,res) => {   
    const roomBody = req.body 
    let redisData = await redis_client.get(`GetRoomsBySpaceId-${req.body.spaceID}`)
    let newRedisData = [];
    if(redisData)
        newRedisData = JSON.parse(redisData)    
    await neo4j.model("Room").create({
        name: roomBody.name,
        floor: roomBody.floor,
        size: roomBody.size,
        price: roomBody.price
    }).then(async room => {                        
            neo4j.writeCypher(`match (r:Room {ID: "${room._properties.get("ID")}"}),(s:Space {ID: "${req.body.spaceID}"}) create (s)-[rel:HASROOMS]->(r) return s,r,rel`)
            .then(result => {  
                console.log(result);               
            })
            .catch(err => console.log(err))
        let roomDTO = { 
            ID: room._properties.get('ID'),
            name:room._properties.get('name'),
            floor:room._properties.get('floor'),
            size : room._properties.get('size'),
            price:room._properties.get('price')
        }
        newRedisData.push(roomDTO)
        redis_client.setEx(`GetRoomsBySpaceId-${req.body.spaceID}`,600,JSON.stringify(newRedisData))
        res.status(200).send(roomDTO)
            
        })        
    .catch(err => res.send(err).status(400));
}

const DeleteRoom = async (req,res) => { 
    let roomBody = req.body   
    try { 
        let room = await neo4j.model("Room").find(roomBody.ID)
        if (!room) {
            return res.status(400).send("Object not found.")
        }
        room.delete()
        res.status(200).send("")
    }
    catch(e) { 
        res.status(400).end(e.message || e.toString())
    }
}

const UpdateRoom = async (req,res) => { 
    try {
        let room = await neo4j.model('Room').find(req.params.ID);
        if (!room) { 
            res.status(400).send("Couldn't find room.");
            return;
        }
        await room.update({
            name: req.body.name,
        });
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}
//Vraća sve sobe po ID-u Space-a u kome se nalazi
const GetRoomsBySpaceId = async (req,res) => {
    try {
        redisData = await redis_client.get(`GetRoomsBySpaceId-${req.params.ID}`)
        if(redisData){
            res.status(200).send(JSON.parse(redisData))
            return;
        }  
        neo4j.cypher(`match (:Space {ID : "${req.params.ID}"}) -[:HASROOMS]->(room:Room) return room`)
        .then(result => {
            let roomsDTO = RoomsToJSON(cypherLookup(result.records,'room'));
            redis_client.setEx(`GetRoomsBySpaceId-${req.params.ID}`, 600,JSON.stringify(roomsDTO))  
            res.status(200).send(roomsDTO)
        }).catch(err => console.log(err))
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}

module.exports = {
    GetRoom,
    CreateRoom,
    DeleteRoom,
    UpdateRoom,
    GetRoomsBySpaceId,
};