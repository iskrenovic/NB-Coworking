const neo4j = require('../config/neo4j_config');
const redis_client = require('../config/redis_config')
const {cypherLookup} = require('../helpers')
//Ovo je funkcija kojom Reservation koji je vraćen od strane neo4j-a pretvaramo u JSON
const ReservationsToJSON = (records) =>{
    let item= []
    records.forEach(element => {
        element._fields.forEach(field=>{
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
//Vraća Reservation sa zadatim ID-em
const GetReservation = async(req,res) =>{
    let uuid = req.params.ID
    try { 
        let Reservation = await neo4j.model('Reservation').find(uuid)
        let reservation = {
            dateStart : Reservation._properties.get("dateStart"),
            dateEnd : Reservation._properties.get("dateEnd"),
            ID : Reservation._properties.get("ID"),
            status: Reservation._properties.get('status')
        }
        res.status(200).send(reservation)
    }
    catch(e) { 
        res.status(500).end(e.message || e.toString())
    }
}
//Ovo je funkcija kojom vlasnik prostora može da prihvati rezervaciju
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
            status:reservation._properties.get('status'),
            ID : reservation._properties.get("ID"),
        };
        let msg = {
            messageType: "reservation",
            messageSubType: "business",
            destination: user[0].properties.ID,//OWNER ID,
            sender: owner[0].properties.ID, //USER ID,
            reservation: reso, //RESERVATION
        }
        redis_client.publish("app:user", JSON.stringify(msg));
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}
//Ovo je funkcija kojom vlasnik prostora može da odbije rezervaciju
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
            status:reservation._properties.get('status'),
            ID : reservation._properties.get("ID"),
        };
        let msg = {
            messageType: "reservation",
            messageSubType: "business",
            destination: user[0].properties.ID,//OWNER ID,
            sender: owner[0].properties.ID, //USER ID,
            reservation: reso, //RESERVATION
        }
        redis_client.publish("app:user", JSON.stringify(msg));
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}
//Ovom funkcijom korisnik tipa business rezerviše celu sobu
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
            status:reservation._properties.get('status'),
            ID:reservation._properties.get("ID")
        };
        let msg = {
            messageType: "reservation",
            messageSubType: "business",
            destination: owner[0].properties.ID,//OWNER ID,
            sender: business[0].properties.ID, //USER ID,
            reservation: reso, //RESERVATION
        }
        redis_client.publish("app:user", JSON.stringify(msg));
        
        res.status(200).send(reso)            
    })        
    .catch(err => res.send(err).status(400));
}
//Ovom funkcijom korisnik tipa freelancer rezerviše mesto
const CreateReservationAsFreelancer = async (req,res) => {   
    
    const reservationBody = req.body    
    await neo4j.model("Reservation").create({
        dateStart: reservationBody.dateStart,
        dateEnd: reservationBody.dateEnd,
        status:'pending'
    }).then(async reservation => {    
                                     
        let ans = await neo4j.writeCypher(`match (r:Reservation {ID: "${reservation._properties.get("ID")}"}),(p:Place {ID: "${req.body.placeID}"}) <-[:HASPLACES]-(:Room) <-[HASROOMS]-(:Space) <-[:OWNER]-(o:Owner),(f:Freelancer {ID: "${req.body.userID}"}) create (p)-[:RENTPLACE]->(r), (f)-[:FRENT]->(r),(f)-[:RENT]->(r), (o)-[:RESFOROWNER]->(r) return  o,f`)
        console.log(ans.records);
        let owner = cypherLookup(ans.records, 'o');
        let freelancer = cypherLookup(ans.records, 'f');
        let reso = {
            dateStart: reservation._properties.get('dateStart'),
            dateEnd: reservation._properties.get('dateEnd'),
            status:reservation._properties.get('status'),
            ID:reservation._properties.get("ID")
        };
        let msg = {
            messageType: "reservation",
            messageSubType: "freelancer",
            destination: owner[0].properties.ID,//OWNER ID,
            sender: freelancer[0].properties.ID, //USER ID,
            reservation: reso, //RESERVATION
        }
        redis_client.publish("app:user", JSON.stringify(msg));        
        console.log("RESO", reso);
        res.status(200).send(reso);
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
//Funcija koja vlasniku vraća sve prihvaćene rezervacije u njegovim objektima
const GetAcceptedReservationByOwnerId = (req,res) => {
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:RESFOROWNER]->(r:Reservation {status:'accepted'}) return r`)
    .then(result => {
        let reservations = ReservationsToJSON(result.records)    
        res.status(200).send(reservations)
    }).catch(err => console.log(err))
}
//Funcija koja vlasniku vraća sve rezervacije na čekanju u njegovim objektima
const GetPendingReservationByOwnerId = (req,res) => {
    neo4j.cypher(`match (:User {ID : "${req.params.ID}"}) -[:RESFOROWNER]->(r:Reservation {status:'pending'}) return r`)
    .then(result => {
        let reservations = ReservationsToJSON(result.records)    
        res.status(200).send(reservations)
    }).catch(err => console.log(err))
}

//Ove funkcije su bile u planu da budu implementirane kako bi automatski prihvatali rezervacije, ali kako smo implementirali sistme potvrđivanja od strane vlasnika
//Odlučili smo da odustanemo od te ideje, mada kad smo je iskucali smo je ostavili za neku buduću iteraciju softvera

// const dateUnavailableForPlace = async (dateStart, dateEnd, placeID) => {
//     let resp = await neo4j.cypher(`match (r:Reservation {status: "accepted"})<-[:RENTPLACE]-(p:Place {ID:"${placeID}"}) where
//     (r.dateStart < "${dateStart}" AND r.dateEnd > "${dateEnd}) OR
//     (r.dateStart > "${dateStart}" AND r.dateStart < "${dateEnd}) OR
//     (r.dateEnd < "${dateEnd}" AND r.dateEnd < "${dateStart}) return r;`);
//     return resp.records.length > 0;
// }

// const dateUnavailableForRoom = async (dateStart, dateEnd, roomID) => {
//     let resp = await neo4j.cypher(`match (r:Reservation {status: "accepted"})<-[:RENTROOM]-(r:Room {ID:"${roomID}"}) where
//     (r.dateStart < "${dateStart}" AND r.dateEnd > "${dateEnd}) OR
//     (r.dateStart > "${dateStart}" AND r.dateStart < "${dateEnd}) OR
//     (r.dateEnd < "${dateEnd}" AND r.dateEnd < "${dateStart}) return r;`);
//     return resp.records.length > 0;
// }

module.exports = {
    GetReservation,
    CreateReservationAsBusiness,
    CreateReservationAsFreelancer,
    DeleteReservation,
    AcceptReservation,
    DenyReservation,
    GetAcceptedReservationByOwnerId,
    GetPendingReservationByOwnerId    
};
