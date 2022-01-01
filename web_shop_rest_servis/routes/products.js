const express = require('express');
const { sequelize, Products,Users } = require('/skript jezici projekat/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');
const routep = express.Router();
routep.use(express.json());
routep.use(express.urlencoded({ extended: true }));


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

routep.use(authTokenHeader);


routep.get('/products', (req, res) => {
    Products.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

routep.post('/products', (req, res) => {

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
                    res.status(403).json({msg: `Korisnik ${usr.first_name} nije autorizavan za operaciju`});
                }
            })
            .catch( err => res.status(500).json({msg: `Greska u bazi nije pronadjen korisnik koji zeli da izvrsi operaciju`}) ); 
        }
    });

    
});

routep.put('/products', (req, res) => {

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
            
        }
    });


});

routep.delete('/products', (req, res) => {

    const sema = Joi.object().keys({
        id: Joi.number().require()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else{
            Products.findOne({ where: { id: req.body.id } })
            .then( product => {
                product.destroy()
                .then( row => res.json(row) )
                .catch( err => res.status(500).json(err) );
            })
            .catch( err => res.status(500).json(err) );
        }
    });

 
});

module.exports = routep;