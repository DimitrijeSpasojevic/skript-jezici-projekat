const express = require('express');
const { sequelize, Categories } = require('/skript jezici projekat/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');
const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));



function authTokenHeader(req, res, next) {
    const authHeader = req.headers['Authorization'];
    console.log(`ovo je authHeader${authHeader}`);
    const token = authHeader && authHeader.split(' ')[1];
    console.log(`ovo je Token${token}`);
    if (token == null) return res.status(401).json({ msg: "Korisnik nema token iz product.jsa" });
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.status(403).json({ msg: "Korisnikov token nije dobar iz product.jsa" });
    
        req.user = user;
    
        next();
    });
}

route.use(authTokenHeader);

route.get('/categories', (req, res) => {
    Categories.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.post('/categories', (req, res) => {
    
    const sema = Joi.object().keys({
        name: Joi.string().require(),
        popularity: Joi.number().required(),
        description: Joi.string().max(120).required()
    });

    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else {
            const data = {
                name: req.body.name,
                popularity: req.body.popularity,
                description: req.body.description,
                quantity_of_product: 0
            }
            Categories.create(data)
                .then( row => res.json(row) )
                .catch( err => res.status(500).json(err) );
        }
    });

});


route.put('/categories', (req, res) => {
    
    const sema = Joi.object().keys({
        name: Joi.string().require(),
        popularity: Joi.number().required(),
        description: Joi.string().max(120).required()
    });

    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else {
            Categories.findOne({ where: { name: req.body.name } })
            .then( ctgr => {
                ctgr.name = req.body.name
                ctgr.popularity = req.body.popularity
                ctgr.description = req.body.description
                ctgr.save()
                .then( rows => res.json(rows) )
                .catch( err => res.status(500).json(err) );
            })
            .catch( err => res.status(500).json(err) );  
        }
    });


});

route.delete('/categories', (req, res) => {
    
    const sema = Joi.object().keys({
        id: Joi.number().require(),
    });

    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else {
            Categories.findOne({ where: { id: req.body.id } })
            .then( ctgr => {
                ctgr.destroy()
                .then( row => res.json(row) )
                .catch( err => res.status(500).json(err) );
            })
            .catch( err => res.status(500).json(err) );
        }
    });


        
});

module.exports = route;