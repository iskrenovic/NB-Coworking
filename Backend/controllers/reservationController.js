const neo4j = require('../config/neo4j_config');
const reservation = require('../models/reservationModel');
const owner = require('../models/ownerModel');
//const {RecordsToJSON,NodeTOString, NodeToJson} = require('../helpers')

const ReservationsToJSON = (records) =>{
    let item= []
    records.forEach(element => {
        element._fields.forEach(field=>{
            console.log(field.properties);
            item.push({
                ID: field.properties.ID,
                dateStart:field.properties.dateStart,
                dateEnd:field.properties.dateEnd,
                status:field.properties.status      
            })

        })
    })
    return item
} 

const GetReservation = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Reservation = await neo4j.model('Reservation').find(uuid)
        let reservation = {
            dateStart : Reservation._properties.get("dateStart"),
            dateEnd : Reservation._properties.get("dateEnd"),
            ID : Reservation._properties.get("ID"),
        }
        res.status(200).send(reservation)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}


/*const CreateReservation = async (req,res) => {
    let price = 0
    try { 

        for await (let element of req.body.places) {
            price += await GetPlacePrice(element)
        }
        let reservation = await neo4j.model("Reservation").create({
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
        });
        let reservationJson = NodeToJson(reservation);

        let relationResult = await neo4j.writeCypher(
            `match (b:Business {ID: "${req.body.ID}"}),
                    (r:Reservation {reservationID: "${reservation._properties.get('reservationID')}"})
                    create (b)-[rel:RESERVED]->(r) return rel`);
    
        if (relationResult.records.length < 1) {
            throw new  Error("Couldn't create relation");
        }
        let allPlaces = [];
        for await (let ID of req.body.places) { 
            let placeResult = await neo4j.cypher(
                `match (r:Reservation {reservationID : "${reservation._properties.get("reservationID")}"}),
                (p:Place  {ID: "${ID}"}) 
                create (r)-[rel:RESERVEPLACE]->(p) return p`);
            let placeJson = RecordsToJSON(placeResult.records);
            placeJson.forEach(element => {
                allPlaces.push(element);
            });
            
        }
        let porukaSpace = { 
            messageType: "NewReservation",
            reservation : reservationJson,
            ID: req.body.ID,
            places: allPlaces
        }
        await redis_client.publish("app:space",JSON.stringify(porukaSpace));
        //ili ovako, da u redisu pamtimo samo  orderedok se ne izvrse ali ne cele objekte, vec njihov id i status 
        await redis_client.sAdd('reservations:pending',`'${reservationJson.reservationID}'`);
        // redis_client.hSet('ordersPending',`${orderJson.orderID}`,JSON.stringify(poruka));
        await redis_client.expire('reservations:pending',24*60*60); //problem, hocu da se kes izbrise u 11:59 uvece
        res.status(200).end();
    }
    catch(e) { 
        res.status(500).send(e);
        console.log(e);
    }
    
}*/

/*const AcceprReservation = async (req,res) => {
    let uuid = req.params.ID
    try { 
        let Owner = await neo4j.model('Owner').find(uuid)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}

const DenyReservation = async (req,res) =>{

}*/

const CreateReservationAsBusiness = async (req,res) => {    
    const reservationBody = req.body    
    await neo4j.model("Reservation").create({
        dateStart: reservationBody.dateStart,
        dateEnd: reservationBody.dateEnd,
        status:'pending'
    }).then(async reservation => {                        
            neo4j.writeCypher(`match (r:Reservation {ID: "${reservation._properties.get("ID")}"}),(ro:Room {ID: "${req.body.roomID}"}) <-[:HASROOMS]-(:Space) <-[:OWNER] - (o:Owner),(b:Business {ID: "${req.body.userID}"}) create (ro)-[rel1:RENTROOM]->(r), (b)-[rel2:BRENT]->(r), (o)-[:RESFOROWNER]->(r) return  r,b,ro,rel1,rel2`)
            .then(result => {
                console.log(result);                 
            })
            .catch(err => console.log(err))
       
        res.send({
            dateStart: reservation._properties.get('dateStart'),
            dateEnd: reservation._properties.get('dateEnd'),
            status:reservation._properties.get('status')

        }).status(200)
            
        })        
    .catch(err => res.send(err).status(400));
}

const CreateReservationAsFreelancer = async (req,res) => {    
    const reservationBody = req.body    
    await neo4j.model("Reservation").create({
        dateStart: reservationBody.dateStart,
        dateEnd: reservationBody.dateEnd,
        status:'pending'
    }).then(async reservation => {                                 
        neo4j.writeCypher(`match (r:Reservation {ID: "${reservation._properties.get("ID")}"}),(p:Place {ID: "${req.body.placeID}"}) <-[:HASPLACES]-(:Room) <-[HASROOMS]-(:Space) <-[:OWNER]-(o:Owner),(f:Freelancer {ID: "${req.body.userID}"}) create (p)-[rel1:RENTPLACE]->(r), (u)-[rel2:FRENT]->(r), (o)-[:RESFOROWNER]->(r) return  r,f,p,rel1,rel2`)
        .then(result => {
                console.log(result);       
                res.send({
                        dateStart: reservation._properties.get('dateStart'),
                        dateEnd: reservation._properties.get('dateEnd'),
                        status:reservation._properties.get('status')
                }).status(200)                
            })          
        })
        .catch(err => console.log(err))
       
                
    .catch(err => res.send(err).status(400));
}

const DeleteReservation = async (req,res) => { 
    let reservationBody = req.body   
    try { 
        let reservation = await neo4j.model("Reservation").find(reservationBody.ID)
        if (!reservation) {
            return res.status(400).send("Object not found.")
        }
        reservation.delete()
        res.status(200).send("")
    }
    catch(e) { 
        res.status(400).end(e.message || e.toString())
    }
}

const UpdateReservation = async (req,res) => { 
    try {
        let reservation = await neo4j.model('Reservation').find(req.params.ID);
        if (!reservation) { 
            res.status(400).send("Couldn't find reservation.");
            return;
        }
        await reservation.update({
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd
        });
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const GetReservationByOwnerId = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:OWNER]->(r:Reservation) return r`)
    .then(result => {
        console.log(result.records);
        let reservations = ReservationsToJSON(result.records)    
        res.send(reservations).status(200)
    }).catch(err => console.log(err))
}

module.exports = {
    GetReservation,
    CreateReservationAsBusiness,
    CreateReservationAsFreelancer,
    DeleteReservation,
    UpdateReservation
};
