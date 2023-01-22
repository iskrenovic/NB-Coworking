const { stringify } = require('nodemon/lib/utils');
const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config');
const room = require('../models/roomModel');

const RoomsToJSON = (records) =>{
    let item= []
    records.forEach(element => {
        element._fields.forEach(field=>{
            console.log(field.properties);
            item.push({
                ID: field.properties.ID,
                name:field.properties.name,
                floor:field.properties.floor,
                size:field.properties.size,
                price:field.properties.price    
            })
        })
    })
    return item
}

function RoomDTO(Room) { 
   
    let roomDTO = {
        name : Room._properties.get("name"),
        floor : Room._properties.get("floor"),
        ID : Room._properties.get("ID"),
        size : Room._properties.get("size"),
        price: Room._properties.get("price")
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

/*const GetAllRooms = async (req,res) => { 
    try {                
        redisData = await redis_client.get('rooms')
        if(redisData != null)
            res.status(200).send(JSON.parse(redisData))
        else {           
            let rooms = await neo4j.model('Room').all()
            let roomsDTO = []
            rooms.forEach(element => {
                roomsDTO.push(RoomDTO(element))            
            });
            redis_client.setEx('rooms', 600,JSON.stringify(roomsDTO))
            res.status(200).send(roomsDTO)
        }    
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}*/

const CreateRoom = async (req,res) => {   
    const roomBody = req.body 
    redisData = await redis_client.get('rooms')
    if(redisData!= null)
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
            price:room._properties.get('price')
        }
        newRedisData.push(roomDTO)
        redis_client.setEx('rooms',600,JSON.stringify(newRedisData))
        res.send({
            roomDTO
        }).status(200)
            
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

const GetRoomsBySpaceId = async (req,res) => {
    try {
        redisData = await redis_client.get(`GetRoomsBySpaceId-${req.params.ID}`)
        if(redisData){
            res.status(200).send(JSON.parse(redisData))
            return;
        }  
        neo4j.cypher(`match (:Space {ID : "${req.params.ID}"}) -[:HASROOMS]->(room:Room) return room`)
        .then(result => {
            console.log(result.records);
            let rooms = RoomsToJSON(result.records)
            let roomsDTO = [] 
            result.forEach(element => {
                roomsDTO.push(RoomDTO(element))            
            })
            redis_client.setEx(`GetRoomsBySpaceId-${req.params.ID}`, 600,JSON.stringify(roomsDTO))  
            res.send(rooms).status(200)
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