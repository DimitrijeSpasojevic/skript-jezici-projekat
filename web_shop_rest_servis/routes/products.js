const express = require('express');
const { sequelize, Products,Users } = require('/skript jezici projekat/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));
route.use(authToken);

function authToken(req, res, next) {
    const authHeader = req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: "preazan token" });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: err });
    
        req.user = user;
        next();
    });
}


route.post('/products', (req, res) => {

    const obj = {
        name:req.body.name,
        price:req.body.price,
        description: req.body.description,
        category: req.body.category
    }
    Users.findOne({ where : { id: req.user.userId} })
    .then( usr => {
        if(usr.role){
            Products.create(obj)
                .then( row => res.json(row) )
                .catch( err => res.status(500).json(err) ); 
        }else{
            res.status(403).json({msg: `Korisnik ${usr.first_name} nije autorizavan za operaciju`})
        }
    })
    .catch( err => res.status(500).json(err) )
    
});

module.exports = route;