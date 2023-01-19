const express = require('express')
const router = express.Router()
const neo4j = require('../config/neo4j_config')
const bcrypt = require('bcrypt')
const { GetOwnerByUsername,GetBusinessByUsername,GetFreelancerByUsername } = require('../controllers/loginController')

router.get('/get/username/:id',GetOwnerByUsername);
router.get('/get/username/:id',GetBusinessByUsername);
router.get('/get/username/:id',GetFreelancerByUsername)

router.post('/', async (req,res)=>{
    try{
    let User = await neo4j.first('User', {username : req.body.username})

    if(User == false){
        res.status(404).send('User not found!')
        return;
    }
    
    
    bcrypt.compare(req.body.password, User._properties.get("password"), (err, result)  => {
        if(result){
            let user = {
                username : User._properties.get("username"),
                ID : User._properties.get("ID"),
                role : User._properties.get("role"),
                email : User._properties.get("email"),
                contact : User._properties.get("contact")
            }
            res.send(user);
            return;
        }else{
            res.status(401).send({
                error: "Incorrect password"})
        }
    })  
   }catch(e){
        res.status(500).send(e)
    }
  
})

module.exports = router