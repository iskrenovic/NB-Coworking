const neo4j = require('../config/neo4j_config');
const reservation = require('../models/reservationModel');
//const {RecordsToJSON,NodeTOString, NodeToJson} = require('../helpers')

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

const CreateReservation = async (req,res) => {    
    const reservationBody = req.body    
    await neo4j.model("Reservation").create({
        dateStart: reservationBody.dateStart,
        dateEnd: reservationBody.dateEnd,
    }).then(async reservation => {                        
            neo4j.writeCypher(`match (r:Reservation {ID: "${reservation._properties.get("ID")}"}),(p:Place {ID: "${req.body.placeID}"})
            ,(u:User {ID: "${req.body.userID}"}) create (p)-[rel1:RENTPLACE]->(r), (u)-[rel2:RENT]->(r) return  r,s,p,rel1,rel2`)
            .then(result => {
                console.log(result);                 
            })
            .catch(err => console.log(err))
       
        res.send({
            dateStart: reservation._properties.get('dateStart'),
            dateEnd: reservation._properties.get('dateEnd')
        }).status(200)
            
        })        
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

module.exports = {
    GetReservation,
    CreateReservation,
    DeleteReservation,
    UpdateReservation
};
