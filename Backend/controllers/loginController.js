const neo4j = require('../config/neo4j_config');
const owner = require('../models/ownerModel');
const business = require('../models/businessModel');
const freelancer = require('../models/freelancerModel');
const bcrypt = require('bcrypt');

const RecordsToJSON = (records) =>{
    let item= []    
    records.forEach(element => {       
        item.push(element._fields[0].properties)
    })
    return item
}

const GetOwnerByUsername = (req,res) => {
    neo4j.find('Owner', {username : req.params.id}).then(owner => {
        res.send(RecordsToJSON(owner.records)) 
    }).catch(err => {console.log(err); return "ERROR!"})
}

const GetBusinessByUsername = (req,res) => {
    neo4j.find('Business', {username : req.params.id}).then(business => {
        res.send(RecordsToJSON(business.records)) 
    }).catch(err => {console.log(err); return "ERROR!"})
}

const GetFreelancerByUsername = (req,res) => {
    neo4j.find('Freelancer', {username : req.params.id}).then(freelancer => {
        res.send(RecordsToJSON(freelancer.records)) 
    }).catch(err => {console.log(err); return "ERROR!"})
}

module.exports = {
    GetOwnerByUsername,
    GetBusinessByUsername,
    GetFreelancerByUsername
};