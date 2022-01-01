const express = require('express');
const { sequelize, Users } = require('/skript jezici projekat/models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Joi = require('joi');
const route = express.Router();
const bcrypt = require('bcrypt');
route.use(express.json());
route.use(express.urlencoded({ extended: true }));


// function authTokenHeader(req, res, next) {
//     const authHeader = req.headers['Authorization'];
//     console.log(`ovo je authHeader${authHeader}`);
//     const token = authHeader && authHeader.split(' ')[1];
//     console.log(`ovo je Token${token}`);
//     if (token == null) return res.status(401).json({ msg: "Korisnik nema token" });
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
//         if (err) return res.status(403).json({ msg: "Korisnikov token nije dobar" });
    
//         req.user = user;
    
//         next();
//     });
// }

//route.use(authTokenHeader);

route.get('/users', (req, res) => {
    Users.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

route.post('/users', (req, res) => {

    const sema = Joi.object().keys({
        firstName: Joi.string().require(),
        lastName: Joi.string().required(),
        email: Joi.string().trim().email().required(),
        quantityOfMoney: Joi.number().require(),
        password: Joi.string().min(4).max(12).required()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else{
            const obj = {
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                role: req.body.role,
                email: req.body.email,
                quantity_of_money: req.body.quantityOfMoney,
                password: bcrypt.hashSync(req.body.password, 10)
            }
            Users.create(obj)
            .then( row => res.json(row) )
            .catch( err => res.status(500).json(err) ); 
        }
    });

});

route.put('/users', (req, res) => {

    const sema = Joi.object().keys({
        firstName: Joi.string().require(),
        lastName: Joi.string().required(),
        email: Joi.string().trim().email().required(),
        quantityOfMoney: Joi.number().require(),
        password: Joi.string().min(4).max(12).required()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else{
            Users.findOne({ where : { email: req.user.email} })
             .then( usr => {
                if(usr.role){
                    Users.findOne({ where : { email: req.body.email} })
                    .then(userToUpdate => {
                        userToUpdate.first_name = req.body.firstName
                        userToUpdate.last_name = req.body.lastName
                        userToUpdate.role = req.body.role
                        userToUpdate.email = req.body.email
                        userToUpdate.quantity_of_money = req.body.quantityOfMoney
                        userToUpdate.password = bcrypt.hashSync(req.body.password, 10)
                        userToUpdate.save()
                        .then( rows => res.json(rows) )
                        .catch( err => res.status(500).json(err) );
                    })
                    .catch( err => res.status(500).json(err) );     
                }else{
                     res.status(403).json({msg: `Korisnik ${usr.first_name} nije autorizavan za operaciju`})
                }
                })
            .catch( err => res.status(500).json(err) )
        }
    });
});

route.delete('/users', (req, res) => {

    const sema = Joi.object().keys({
        email: Joi.string().trim().email().required()
    });
    
    Joi.validate(req.body, sema, (err, result) => {
        if (err)
            res.send(err.details[0].message);
        else{
            Users.findOne({ where : { email: req.user.email} })
            .then( usr => {
                if(usr.role){
                    Users.findOne({ where: { email: req.body.email }} )
                        .then( usr => {
                            usr.destroy()
                                .then( rows => res.json(rows) )
                                .catch( err => res.status(500).json(err) );
                        })
                        .catch( err => res.status(500).json(err) );
                }else{
                    res.status(403).json({msg: `Korisnik ${usr.first_name} nije autorizavan za operaciju`})
                }
            })
            .catch( err => res.status(500).json(err) )            
        }
    });
});

module.exports = route;