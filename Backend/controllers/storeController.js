const  neo4j  = require('../config/neo4j_config');
const restoran = require('../models/storeModel');
const token = require('../config/token')
const bcrypt = require('bcrypt');
const redis_client = require('../config/ws.config');
const saltRounds = 10;
const {sortStoresBy} = require('../helpers');

function convertToDTO(store) { 
   
    let storeDTO = {
        uuid: store._properties.get('uuid'),
        username: store._properties.get('username'),
        name: store._properties.get('name'),
        location: store._properties.get('location'),
        preptime: store._properties.get('preptime')
    }
    return storeDTO
  
   
}
const GetTop5 = async (req,res) => { 
    try {                
        redisData = await redis_client.get('top5')
        if(redisData != null)
            res.status(200).send(JSON.parse(redisData))
        else {    
            async function makeArray(allStores) {
                let arr = []
                // console.log(allStores)
                for await (let store of allStores) { 
                    let stored_uuid =  store._properties.get('uuid')
                    let resCypher = await neo4j.cypher(
                        `MATCH (s:Store {uuid: '${stored_uuid}'})-[rel:PREPARES]->(o:Order) return count(rel)`
                    );
                    resCypher.records.forEach(record => { 
                        let relCount = record._fields[0].low
                        arr.push({key: stored_uuid, value: relCount})
                    })
                }
                return arr 
            }

            let result = await neo4j.model('Store').all()
            let allStores = result._values
        
            let stores =  await makeArray(allStores)
            stores = sortStoresBy(stores,"value");
            // stores = stores.sort((a,b) => { 
              
            //     if (a.value > b.value) return  1
            //     if (a.value < b.value) return -1
            //     return 0
            // })
            stores.reverse()
            if (stores.length > 5) 
                stores = stores.slice(0,5)
            let top5 = []
            for (let s of stores) { 
                uuid = s.key
                for (let restaurant of allStores) { 
                    if (restaurant._properties.get('uuid') == uuid) 
                        top5.push(convertToDTO(restaurant))
                }
            }
            top5 = sortStoresBy(top5,"preptime");
            redis_client.setEx('top5', 600,JSON.stringify(top5))
            res.status(200).send(top5)                
        }    
    }
    
    catch(e) {         
        res.status(500).send(e.message || e.toString())
        console.log(e);
    }
}

const CreateStore = async (req,res) => { 
    
    
    bcrypt.hash(req.body.password, saltRounds).then(hash => {

        neo4j.model("Store").create({
            username: req.body.username,
            password: hash,
            name: req.body.name,
            location: req.body.location,
            preptime: null,
            role: "Store"// Simple schema definition of property : type
        
        }).then(store => {

            let user = {
                username : store._properties.get("username"),
                uuid :store._properties.get("uuid"),
                role :store._properties.get("role")
            }
            webtoken = token.generateAccessToken(user)
            res.send({user,webtoken}).status(200)  

        }).catch(err => res.status(400).send(err))

    }).catch(err => res.status(500).send(err))
    
}

const GetStore = async (req,res) => {

    let uuid = req.params.id
    try { 
        let store = await neo4j.model('Store').find(uuid);
        let storeDTO = convertToDTO(store);
        
        res.status(200).send(storeDTO)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }

}

const changePrepTime = async (req,res) => { 
    try 
    { 
        let uuid = req.params.id
        let storeDb = await neo4j.model('Store').find(uuid)
        await storeDb.update({preptime: req.body.preptime})
        res.status(200).send("")
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
    

}

const GetAllStores = async (req,res) => { 
    try {                
        redisData = await redis_client.get('stores')
        if(redisData != null)
            res.status(200).send(JSON.parse(redisData))
        else {           
            let stores = await neo4j.model('Store').all()
            let storesDTO = []
            stores.forEach(element => {
                storesDTO.push(convertToDTO(element))            
            });
            storesDTO = sortStoresBy(storesDTO,"preptime");
            // storesDTO.sort((a,b) => { 
           
            //     if (a.preptime > b.preptime) return  1
            //     if (a.preptime< b.preptime) return -1
            //     return 0
            // })
            redis_client.setEx('stores', 600,JSON.stringify(storesDTO))
            res.status(200).send(storesDTO)
        }    
    }
    catch(e) {         
        res.status(500).send(e.message || e.toString())
    }
}
const GetStoresByCategory = async (req,res) => { 
    try { 
        let category = req.body.category
        let foundStores = []
        let result = await neo4j.cypher(
            `MATCH (s:Store)-[:OFFERS]->(m:Meal)-[r:BELONGS_TO]->(c:Category {name: '${category}'}) RETURN DISTINCT s`)
        result.records.forEach(record => { 
            node = record._fields[0]

            foundStores.push({ 
                name: node.properties.name,
                location: node.properties.location,
                preptime: node.properties.preptime,
                uuid: node.properties.uuid,
                username: node.properties.username
            })
        })
        foundStores = sortStoresBy(foundStores,"preptime");
        // foundStores.sort((a,b) => { 
        //     if (a.preptime > b.preptime) return  1
        //     if (a.preptime< b.preptime) return -1
        //     return 0
        //  })  
        res.status(200).send(foundStores)
    }
    catch(e) {
        res.status(500).send(e)
    }
}



module.exports = {
    CreateStore,
    GetStore,
    GetAllStores,
    changePrepTime,
    GetTop5,
    GetStoresByCategory
}