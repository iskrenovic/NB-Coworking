const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config')
const {cypherLookup} = require('../helpers')
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

const ReservationsAndRoomNameToJSON = (records) =>{
    let item= []
    records.forEach(element => {
        for(let i = 0;i<element._fields.length;i+=2){
            item.push({
                ID: element._fields[i].properties.ID,
                dateStart:element._fields[i].properties.dateStart,
                dateEnd:element._fields[i].properties.dateEnd,
                status:element._fields[i].properties.status,
                price:element._fields[i].properties.price,
                name:element._fields[i + 1]
            });
        }        
    })
    return item
}

const RecordsToJSON = (records) =>{
    let item= []    
    records.forEach(element => {       
        item.push(element._fields[0].properties)
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

const AcceptReservation = async (req,res) => {
    try {
        let reservation = await neo4j.model('Reservation').find(req.params.ID);
        
        if (!reservation) { 
            res.status(400).send("Couldn't find reservation.");
            return;
        }
        await reservation.update({            
            status:'accepted'
        });
        cypher = await neo4j.cypher(`Match (o:Owner)-[:RESFOROWNER]->(r:Reservation {ID:"${req.params.ID}"})<-[:RENT]-(u:User) return o, u`)
        let owner = cypherLookup(cypher.records, 'o');
        let user = cypherLookup(cypher.records,'u');
        let reso = {
            dateStart: reservation._properties.get('dateStart'),
            dateEnd: reservation._properties.get('dateEnd'),
            status:reservation._properties.get('status')
        };
        let msg = {
            messageType: "reservation",
            messageSubType: "business",
            destination: user[0].properties.ID,//OWNER ID,
            sender: owner[0].properties.ID, //USER ID,
            reservation: reso, //RESERVATION
        }
        console.log(msg);
        redis_client.publish("app:user", JSON.stringify(msg));
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const DenyReservation = async (req,res) =>{
    try {
        let reservation = await neo4j.model('Reservation').find(req.params.ID);
        if (!reservation) { 
            res.status(400).send("Couldn't find reservation.");
            return;
        }
        await reservation.update({
            status:'denied'
        });
        cypher = await neo4j.cypher(`Match (o:Owner)-[:RESFOROWNER]->(r:Reservation {ID:"${req.params.ID}"})<-[:RENT]-(u:User) return o, u`)
        let owner = cypherLookup(cypher.records, 'o');
        let user = cypherLookup(cypher.records,'u');
        let reso = {
            dateStart: reservation._properties.get('dateStart'),
            dateEnd: reservation._properties.get('dateEnd'),
            status:reservation._properties.get('status')
        };
        let msg = {
            messageType: "reservation",
            messageSubType: "business",
            destination: user[0].properties.ID,//OWNER ID,
            sender: owner[0].properties.ID, //USER ID,
            reservation: reso, //RESERVATION
        }
        console.log(msg);
        redis_client.publish("app:user", JSON.stringify(msg));
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}

const CreateReservationAsBusiness = async (req,res) => {    
    const reservationBody = req.body    
    await neo4j.model("Reservation").create({
        dateStart: reservationBody.dateStart,
        dateEnd: reservationBody.dateEnd,
        status:'pending'
    }).then(async reservation => {                        
        let ans = await neo4j.writeCypher(`match (r:Reservation {ID: "${reservation._properties.get("ID")}"}),(ro:Room {ID: "${req.body.placeID}"}) <-[:HASROOMS]-(:Space) <-[:OWNER] - (o:Owner),(b:Business {ID: "${req.body.userID}"}) create (ro)-[:RENTROOM]->(r), (b)-[:BRENT]->(r), (b)-[:RENT]->(r), (o)-[:RESFOROWNER]->(r) return  o,b `);
        let owner = cypherLookup(ans.records, 'o');
        let business = cypherLookup(ans.records, 'b');
        let reso = {
            dateStart: reservation._properties.get('dateStart'),
            dateEnd: reservation._properties.get('dateEnd'),
            status:reservation._properties.get('status')
        };
        let msg = {
            messageType: "reservation",
            messageSubType: "business",
            destination: owner[0].properties.ID,//OWNER ID,
            sender: business[0].properties.ID, //USER ID,
            reservation: reso, //RESERVATION
        }
        redis_client.publish("app:user", JSON.stringify(msg));
        
        res.send(reso).status(200)
            
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
                                     
        neo4j.writeCypher(`match (r:Reservation {ID: "${reservation._properties.get("ID")}"}),(p:Place {ID: "${req.body.placeID}"}) <-[:HASPLACES]-(:Room) <-[HASROOMS]-(:Space) <-[:OWNER]-(o:Owner),(f:Freelancer {ID: "${req.body.userID}"}) create (p)-[:RENTPLACE]->(r), (f)-[:FRENT]->(r),(f)-[:RENT]->(r), (o)-[:RESFOROWNER]->(r) return  r,f,p,`)
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

/*const UpdateReservation = async (req,res) => { 
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
}*/

const GetAcceptedReservationByOwnerId = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:RESFOROWNER]->(r:Reservation {status:'accepted'}) return r`)
    .then(result => {
        console.log(result.records);
        let reservations = ReservationsToJSON(result.records)    
        res.send(reservations).status(200)
    }).catch(err => console.log(err))
}

const GetPendingReservationByOwnerId = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:RESFOROWNER]->(r:Reservation {status:'pending'}) return r`)
    .then(result => {
        console.log(result.records);
        let reservations = ReservationsToJSON(result.records)    
        res.send(reservations).status(200)
    }).catch(err => console.log(err))
}

/*const GetPendingReservationByOwnerIdRoom = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:RESFOROWNER]->(r:Reservation {status:'pending'}) -[:RENTROOM]->(ro:Room), return r,ro.name`)
    .then(result => {
        console.log(result.records);
        let reservationsforrooms = ReservationsAndRoomNameToJSON(result.records)    
        res.send(reservationsforrooms).status(200)
    }).catch(err => console.log(err))
}

const GetPendingReservationByOwnerIdPlace = (req,res) => {
    console.log(req.params.ID);
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:RESFOROWNER]->(r:Reservation {status:'pending'}) -[:RENTPLACE]->(p:Place), return r,p.name`)
    .then(result => {
        console.log(result.records);
        let reservationsforplaces = ReservationsAndRoomNameToJSON(result.records)    
        res.send(reservationsforplaces).status(200)
    }).catch(err => console.log(err))
}*/

module.exports = {
    GetReservation,
    CreateReservationAsBusiness,
    CreateReservationAsFreelancer,
    DeleteReservation,
    AcceptReservation,
    DenyReservation,
    GetAcceptedReservationByOwnerId,
    GetPendingReservationByOwnerId
    //GetPendingReservationByOwnerIdRoom,
    //GetPendingReservationByOwnerIdPlace
};
