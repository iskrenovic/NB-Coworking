const neo4j = require('../config/neo4j_config');
const room = require('../models/roomModel');

const GetRoom = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Room = await neo4j.model('Room').find(uuid)
        let room = {
            name : Room._properties.get("name"),
            floor : Room._properties.get("floor"),
            ID : Room._properties.get("ID"),
            size : Room._properties.get("size"),
        }
        res.status(200).send(room)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const CreateRoom = (req,res) => {    
    const roomBody = req.body    
    neo4j.model("Room").create({
        name: roomBody.name,
        floor: roomBody.floor,
        size: roomBody.size,
    }).then(room => {                        
            neo4j.cypher(`match (r:Room {ID: "${room._properties.get("ID")}"})`)
            .then(result => {                 
            })
            .catch(err => console.log(err))
       
        res.send(room).status(200)
            
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

module.exports = {
    GetRoom,
    CreateRoom,
    DeleteRoom,
    UpdateRoom
};