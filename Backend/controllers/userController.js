const neo4j = require('../config/neo4j_config');
const user = require('../models/userModel');
const token = require('../config/token');
const bcrypt = require('bcrypt');

const UsersToJSON = (records) =>{
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
}

const GetUser = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let User = await neo4j.model('User').find(uuid)
        let user = {
            username : User._properties.get("username"),
            ID : User._properties.get("ID"),
            role : User._properties.get("role"),
            email : User._properties.get("email"),
            contact : User._properties.get("contact")
        }
        res.status(200).send(user)
    }
    catch(e) { 
        console.log(e.message);
        res.status(500).end(e.message || e.toString())
    }
}

const CreateUser = async (req,res) => {    
    const userBody = req.body    
    //console.log(userBody)
    neo4j.model("User").create({
        username: userBody.username,
        password: userBody.password,
        role: userBody.role,
        email: userBody.email,
        contact: userBody.contact
    }).then(async user => {    
            //console.log("Uso sam")      
            // await neo4j.writeCypher(`match (u:User {ID: "${user._properties.get("ID")}"}),(s:Space {ID: "${req.body.spaceID}"}) create (s)-[rel:USESSPACE]->(u) return s,u,rel`)
            // .then(result => { 
            //     console.log(result);                
            // })
            // .catch(err => console.log(err))
       
        res.status(200).send({
            ID: user._properties.get('ID'),
            name:user._properties.get('name')
        })
            
        })        
    .catch(err => res.send(err).status(400));
}

const DeleteUser = async (req,res) => { 
    let userBody = req.body   
    try { 
        let user = await neo4j.model("User").find(userBody.ID)
        if (!user) {
            return res.status(400).send("Object not found.")
        }
        user.delete()
        res.status(200).send("")
    }
    catch(e) { 
        res.status(400).end(e.message || e.toString())
    }
}

const UpdateUser = async (req,res) => { 
    try {
        let user = await neo4j.model('User').find(req.params.ID);
        if (!user) { 
            res.status(400).send("Couldn't find user.");
            return;
        }
        await user.update({
            email: req.body.email,
            contact: req.body.contact
        });
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const GetUserBySpaceId = (req,res) => {
    neo4j.cypher(`match (space:Space {ID : "${req.params.ID}"})
    -[rel:CONTAINS]->(user:User) return user`).then(result => {
        
        let users = UsersToJSON(result.records)    
        res.status(200).send(users)
    }).catch(err => console.log(err))
}

module.exports = {
    GetUser,
    CreateUser,
    DeleteUser,
    UpdateUser,
    GetUserBySpaceId
};