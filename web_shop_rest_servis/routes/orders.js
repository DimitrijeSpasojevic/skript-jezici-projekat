const express = require('express');
const { sequelize, Orders,Users } = require('/skript jezici projekat/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');
const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.get('/orders', (req, res) => {
    Orders.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.post('/orders', (req, res) => {

    const sema = Joi.object().keys({
        usrID: Joi.number().require(),
        current_value: Joi.number().require(),
        discount: Joi.number().required(),
        type_of_delivery: Joi.string().required()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else {
            res.send(result);
        }
    });
    const obj = {
        usrID:req.body.name,
        current_value:req.body.price,
        discount: req.body.description,
        type_of_delivery: req.body.type_of_delivery,
        urgent: req.body.urgent
    }
    Users.findOne({ where : { id: req.user.userId} })
    .then( usr => {
        if(usr.role){
            Orders.create(obj)
                .then( row => res.json(row) )
                .catch( err => res.status(500).json(err) ); 
        }else{
            res.status(403).json({msg: `Korisnik ${usr.first_name} nije autorizavan za operaciju`})
        }
    })
    .catch( err => res.status(500).json(err) ) 
});

route.put('/orders', (req, res) => {

    const sema = Joi.object().keys({
        usrID: Joi.number().require(),
        current_value: Joi.number().require(),
        discount: Joi.number().required(),
        type_of_delivery: Joi.string().required()
    });

    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else {
            res.send(result);
        }
    });

    Orders.findOne({ where : { id: req.body.id} })
    .then( order => {
        order.userId = req.body.userId
        order.current_value = req.body.current_value
        order.discount = req.body.discount
        order.type_of_delivery = req.body.type_of_delivery
        order.urgent = req.body.urgent
        order.save()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
    })
    .catch( err => res.status(500).json(err) ) 
});

route.delete('/orders', (req, res) => {

    const sema = Joi.object().keys({
        id: Joi.number().require()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
    });
    Orders.findOne({ where: { id: req.body.id } })
        .then( order => {
            order.destroy()
            .then( row => res.json(row) )
            .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err) );
 
});

module.exports = route;