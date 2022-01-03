const express = require('express');
const { sequelize, Users} = require('/skript jezici projekat/models');
const products = require('./routes/products');
const users = require('./routes/users');
const categories = require('./routes/categories');
const orders = require('./routes/orders');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cors = require('cors');
app.use(express.json());



var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}


app.use(cors(corsOptions));

// function getCookies(req) {
//     if (req.headers.cookie == null) return {};

//     const rawCookies = req.headers.cookie.split('; ');
//     const parsedCookies = {};

//     rawCookies.forEach( rawCookie => {
//         const parsedCookie = rawCookie.split('=');
//         parsedCookies[parsedCookie[0]] = parsedCookie[1];
//     });

//     return parsedCookies;
// };

// function authToken(req, res, next) {
//     const cookies = getCookies(req);
//     const token = cookies['token'];
  
//     if (token == null) return res.send({msg : "token je null kaze app_rest"});
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
//         if (err)  return res.send({msg : "token nije dobar ali nije null, kaze app_rest"});
    
//         req.user = user;
    
//         next();
//     });
// }
// app.use(authToken);

app.post('/register', (req, res) => {

    const obj = {
        first_name: req.body.name,
        last_name: req.body.name,
        email: req.body.email,
        role : req.body.role,
        quantity_of_money: 0,
        password: bcrypt.hashSync(req.body.password, 10)
    };


     Users.create(obj).then( row => {
         res.json(row);
     }).catch( err => {res.status(500).json(err);
                      console.log(err)});

});

app.use('/admin', users);
app.use('/admin', products);
app.use('/admin', categories);
app.use('/admin', orders);

app.listen({ port: 8080 }, async () => {
    await sequelize.authenticate();
    console.log(`pokrenuta na portu 8080 rest servis`)
});