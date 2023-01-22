const neo4j = require('../config/neo4j_config');
const owner = require('../models/ownerModel');
const business = require('../models/businessModel');
const freelancer = require('../models/freelancerModel');
const bcrypt = require('bcrypt');
//const { GetOwnerByUsername,GetBusinessByUsername,GetFreelancerByUsername } = require('../controllers/loginController')
const saltRounds = 10;

const CreateOwner = async (req,res) => {  

    /*let ownerExists=GetOwnerByUsername(req.body.username)
    let businessExists=GetBusinessByUsername(req.body.username)
    let freelancerExists=GetFreelancerByUsername(req.body.username)
    if(ownerExists==null)*/
    if(await usernameTaken(req.body.username)){
        res.status(409).send("USERNAME TAKEN");
        return;
    }
    //Sve šifre obavezo heširamo kako se ne bi čuvale u svom normalnom stanju i ne bi bile sigurnosni rizik
    bcrypt.hash(req.body.password, saltRounds).then(hash => {

        neo4j.model("Owner").create({
            username: req.body.username,
            email: req.body.email,
            contact: req.body.contact,
            name: req.body.name,
            surname: req.body.surname,
            password: hash,
            role: "owner"
        
        }).then(owner => {

            let user = {
                username : owner._properties.get("username"),
                ID :owner._properties.get("ID"),
                email : owner._properties.get("email"),
                contact : owner._properties.get("contact"),
                role :owner._properties.get("role")
            }
            res.status(200).send(user)  

        }).catch(err => {
            console.log(err);
            res.status(400).send(err)})

    }).catch(err => res.status(500).send(err))
}

const CreateBusiness = async (req,res) => {  
    if(await usernameTaken(req.body.username)){
        res.status(409).send("USERNAME TAKEN");
        return;
    }
    bcrypt.hash(req.body.password, saltRounds).then(hash => {

        neo4j.model("Business").create({
            username: req.body.username,
            email: req.body.email,
            contact: req.body.contact,
            name: req.body.name,
            nr_emplyees: req.body.nr_emplyees,
            password: hash,
            role: "business"
        
        }).then(business => {

            let user = {
                username : business._properties.get("username"),
                ID :business._properties.get("ID"),
                email : business._properties.get("email"),
                contact : business._properties.get("contact"),
                role :business._properties.get("role")
            }
            res.status(200).send(user)  

        }).catch(err => res.status(400).send(err))

    }).catch(err => res.status(500).send(err))
}

const CreateFreelancer = async (req,res) => {  
    if(await usernameTaken(req.body.username)){
        res.status(409).send("USERNAME TAKEN");
        return;
    }
    bcrypt.hash(req.body.password, saltRounds).then(hash => {

        neo4j.model("Freelancer").create({
            username: req.body.username,
            email: req.body.email,
            contact: req.body.contact,
            name: req.body.name,
            address: req.body.address,
            password: hash,
            role: "freelancer"
        
        }).then(freelancer => {

            let user = {
                username : freelancer._properties.get("username"),
                ID :freelancer._properties.get("ID"),
                email : freelancer._properties.get("email"),
                contact : freelancer._properties.get("contact"),
                role :freelancer._properties.get("role")
            }
            res.status(200).send(user)

        }).catch(err => res.status(400).send(err))

    }).catch(err => res.status(500).send(err))
}
//Proveravamo da nije neki username zauzet za svaki slučaj
const usernameTaken = async (username, email) => {
    let resp = await neo4j.cypher(`match (user:User) where user.username = "${username}" OR user.email = "${email}" return user;`);
    return resp.records.length > 0;
}

module.exports = {
    CreateOwner,
    CreateBusiness,
    CreateFreelancer
};