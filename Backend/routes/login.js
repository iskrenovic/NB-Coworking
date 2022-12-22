const express = require('express')
const router = express.Router()
const neo4j = require('../config/neo4j_config')
const token = require('../config/token')
const bcrypt = require('bcrypt')
const { GetCustomerByUsername } = require('../controllers/customerController')
const { GetDelivererByUsername } = require('../controllers/delivererController')



router.post('/', async (req,res)=>{
    try{
    let User = await neo4j.first('User', {username : req.body.username})

    if(User == false)
        res.status(404).send('User not found!')
    
    
    bcrypt.compare(req.body.password, User._properties.get("password"), (err, result)  => {
        if(result){
            let user = {
                username : User._properties.get("username"),
                uuid :User._properties.get("uuid"),
                role :User._properties.get("role")
            }
            var webtoken = token.generateAccessToken(user)
            res.send({user,webtoken});
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