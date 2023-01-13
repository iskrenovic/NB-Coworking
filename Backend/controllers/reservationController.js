const neo4j = require('../config/neo4j_config');
const reservation = require('../models/reservationModel');

const GetReservation = async(req,res) =>{
    let uuid = req.params.id
    try { 
        let Reservation = await neo4j.model('Reservation').find(ID)
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

const CreateReservation = (req,res) => {    
    const reservationBody = req.body    
    neo4j.model("Reservation").create({
        dateStart: reservationBody.dateStart,
        dateEnd: reservationBody.dateEnd,
    }).then(reservation => {                        
            neo4j.cypher(`match (r:Reservation {ID: "${reservation._properties.get("ID")}"})`)
            .then(result => {                 
            })
            .catch(err => console.log(err))
       
        res.send(reservation).status(200)
            
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
