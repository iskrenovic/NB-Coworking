
const neo4j = require('../config/neo4j_config');
const customer = require('../models/customerModel');
const token = require('../config/token')
const bcrypt = require('bcrypt');
const statusFlags = require('../statusFlags');

const saltRounds = 10;

const RecordsToJSON = (records) =>{
    let item= []    
    records.forEach(element => {       
        item.push(element._fields[0].properties)
    })
    return item
} 

const CreateCustomer = async (req,res) => {  

    bcrypt.hash(req.body.password, saltRounds).then(hash => {

        neo4j.model("Customer").create({
            name: req.body.name,  
            surname: req.body.surname,
            location: req.body.location,
            username: req.body.username,
            password: hash,
            role: "Customer"// Simple schema definition of property : type
        
        }).then(customer => {

            let user = {
                username : customer._properties.get("username"),
                uuid :customer._properties.get("uuid"),
                role :customer._properties.get("role")
            }
            webtoken = token.generateAccessToken(user)
            res.send({user,webtoken}).status(200)  

        }).catch(err => res.status(400).send(err))

    }).catch(err => res.status(500).send(err))
}

const GetCustomerByUsername = (req,res) => {
    neo4j.find('Customer', {username : req.params.id}).then(customer => {
        res.send(RecordsToJSON(customer.records)) 
    }).catch(err => {console.log(err); return "ERROR!"})
}


const GetCustomer = (req,res) => {
    neo4j.find('Customer',req.params.id).then(user => {
        userDTO = {
            name: user._properties.get('name'),
            surname: user._properties.get('surname'),
            username: user._properties.get('username'),
            uuid: user._properties.get('uuid'),
            location: user._properties.get('location') 
        }
        res.send(userDTO).status(200)
    }).catch(err => res.send(err).status(400))
}
const GetPreviousOrders = async (req,res) => {
    let result = await neo4j.cypher(`match (c:Customer {uuid : "${req.params.id}"})-[rel:ORDERED]->(o:Order {status: "Finished"}) return o`)
    let orders = RecordsToJSON(result.records)
    let ordersWithMeals = []
    for await (let order of orders) { 
        let sres = await neo4j.cypher(`match (o:Order {orderID : "${order.orderID}"})<-[rel:PREPARES]-(s:Store) return s`)
        let store = RecordsToJSON(sres.records)
        let result = await neo4j.cypher(`match (m:Meal)<-[:CONTAINS]-(o:Order { orderID: '${order.orderID}'}) return m`)
        let meals = RecordsToJSON(result.records)
        ordersWithMeals.push({order: order, meals: meals,store: store})
        // console.log("Meal:",meals);

    }
    // console.log("OrdersMeals",ordersWithMeals[0].meals);
    res.send(ordersWithMeals).status(200)
    
}

const ChangeLocation = async (req,res) => { 
    try { 
        let customer = await neo4j.model('Customer').find(req.params.id)
        if (!customer) {
            res.status(400).send("Customer not found")
            return
        }
        customer.update({location: req.body.location})
        res.status(200).send("")
    }
    catch(e) { 
        res.status(500).send(e)
    }
}

const RecommendedMeals = async (req,res) => { 
    try {
        //req.params.id - customerID 
        let customerID = req.params.id;

        //nadji  jela tom customeru sa njihovim kateogorijama 
        let queryResult = await neo4j.cypher(
            `match (c:Customer {uuid: "${customerID}"}) 
                -[:ORDERED]-> (o:Order {status: "${statusFlags.finished}"})
                -[:CONTAINS]-> (m:Meal)
                -[:BELONGS_TO]->(cat:Category)

                return m,cat order by rand() limit 5`
        );
        if (queryResult.records.length === 0) { 
            res.status(200).send([]);
            return;
        }

        //pretovori u JSOn
        let meals_categoriesDB = [];
        queryResult.records.forEach(record => { 
            let meal_category = new Object();
            meal_category.meal = record._fields[0].properties;
            meal_category.category = record._fields[1].properties;

            meals_categoriesDB.push(meal_category);
        });
       
        //pribavi slicna jela iz tih kategorija (a da nisu ta koja je vec porucio) i restoranID uz njih
        //ekstrakcija 
        let extractedCategories = new Set();
        let extractedMealsIDs = [];
        meals_categoriesDB.forEach(element => {
            extractedCategories.add(`'${element.category.name}'`);
            extractedMealsIDs.push(`'${element.meal.mealID}'`);
        });
        console.log(extractedCategories);
        //pribavljanje
        queryResult = await neo4j.cypher(
            `match (s:Store) -[:OFFERS]-> (m:Meal) -[:BELONGS_TO]-> (cat:Category)
                where cat.name in [${Array.from(extractedCategories)}] and 
                not m.mealID in [${extractedMealsIDs}]
                return m,s order by rand() limit 5`
        );
        if (queryResult.records.length === 0) { extractedCategories
            res.status(400).send("Couldn't load similar meals.");
        }

        //pretvaranje u JSON
        let meals_storesDB = [];
        queryResult.records.forEach(record => { 
            let meal_store = new Object();
            meal_store.meal = record._fields[0].properties;
            meal_store.store = record._fields[1].properties;

            meals_storesDB.push(meal_store);
        });
        
        res.status(200).send(meals_storesDB);
        //ako nema nijednu porudzbinu pribavi top 5 kategorije, pa prikazi neku hranu odatle
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = {
    RecommendedMeals,
    CreateCustomer,
    GetCustomer,
    GetCustomerByUsername,
    GetPreviousOrders,
    ChangeLocation
};