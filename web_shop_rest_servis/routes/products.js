const express = require('express');
const { sequelize, Products,Users } = require('/skript jezici projekat/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');
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


route.get('/products', (req, res) => {
    Products.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});


route.post('/products', (req, res) => {

    const sema = Joi.object().keys({
        name: Joi.string().require(),
        price: Joi.number().required(),
        description: Joi.string().max(120).required(),
        category: Joi.string().require(),
        rate: Joi.number().min(0).max(5).require()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else {
            res.send(result);
        }
    });
    const obj = {
        name:req.body.name,
        price:req.body.price,
        description: req.body.description,
        category: req.body.category,
        rate: req.body.rate
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


route.put('/products', (req, res) => {

    const sema = Joi.object().keys({
        name: Joi.string().require(),
        price: Joi.number().required(),
        description: Joi.string().max(120).required(),
        category: Joi.string().require(),
        rate: Joi.number().min(0).max(5).require()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else {
            res.send(result);
        }
    });

    Products.findOne({ where : { id: req.body.id} })
    .then( Product => {
        Product.name = req.body.name
        Product.price = req.body.price
        Product.description = req.body.description
        Product.category = req.body.category
        Product.rate = req.body.rate
        Product.save()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
    })
    .catch( err => res.status(500).json(err) ) 
    
});

route.delete('/products', (req, res) => {

    const sema = Joi.object().keys({
        id: Joi.number().require()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
    });
    Products.findOne({ where: { id: req.body.id } })
        .then( product => {
            product.destroy()
            .then( row => res.json(row) )
            .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
 
});

module.exports = route;