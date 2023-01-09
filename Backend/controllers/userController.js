const neo4j = require('../config/neo4j_config');
const user = require('../models/userModel');

const GetUser = async(req,res) =>{
    let uuid = req.params.id
    try { 
        let User = await neo4j.model('User').find(ID)
        let user = {
            username : User._properties.get("username"),
            password : User._properties.get("password"),
            ID : User._properties.get("ID"),
            role : User._properties.get("role"),
            email : User._properties.get("email"),
            contact : User.properties.get("contact")
        }
        res.status(200).send(user)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const CreateUser = (req,res) => {    
    const userBody = req.body    
    neo4j.model("User").create({
        username: userBody.username,
        password: userBody.password,
        role: userBody.role,
        email: userBody.email,
        contact: userBody.contact
    }).then(user => {    
        
            
            neo4j.cypher(`match (u:User {ID: "${user._properties.get("ID")}"})`)
            .then(result => {                 
            })
            .catch(err => console.log(err))
       
        res.send(meal).status(200)
            
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

module.exports = {
    GetUser,
    CreateUser,
    DeleteUser,
    UpdateUser
};