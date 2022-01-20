const express = require('express');
const { sequelize, Messages} = require('../models');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const http = require('http');
const { Server } = require("socket.io");
const history = require('connect-history-api-fallback');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
        credentials: true
    },
    allowEIO3: true
});

const cors = require('cors');
app.use(express.json());
app.use(cors(corsOptions));


var corsOptions = {
    origin: "*", 
    optionsSuccessStatus: 200
}

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './static' });
});

app.use(express.static(path.join(__dirname, 'static')));

function authSocket(msg, next) {
    
    if (msg[1].token == null) {
        next(new Error("Not authenticated"));
    } else {
        jwt.verify(msg[1].token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                next(new Error(err));
            } else {
                msg[1].user = user;
                next();
            }
        });
    }
}

io.on('connection', socket => {
    socket.use(authSocket);
 
    socket.on('comment', msg => {
        Messages.create({ body: msg.body, userId: msg.user.userId })
            .then( rows => {
                Messages.findOne({ where: { id: rows.id }, include: ['user'] })
                    .then( msg => io.emit('comment', JSON.stringify(msg)) ) 
            }).catch( err => socket.emit('error', err.message) );
    });

    socket.on('error', err => socket.emit('error', err.message) );
});

const staticMdl = express.static(path.join(__dirname, 'dist'));

app.use(staticMdl);

app.use(history({ index: '/index.html' }));

app.use(staticMdl);

server.listen({ port: 8000 }, async () => {
    await sequelize.authenticate();
    console.log("pokrenuta na portu 8000 gui servis")
});