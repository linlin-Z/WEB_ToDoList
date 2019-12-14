'use strict'

const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const session = require("express-session");

const listRoutes = require('./routes/list')
const taskRoutes = require('./routes/task')
const subTaskRoutes = require('./routes/subTask')
const defaultRoute = require('./routes/default')
const userRoute = require('./routes/user')
const apiRoute = require('./routes/api')

app.set('view engine', 'pug')

app.use(express.static((__dirname, 'public')))
app.use(express.urlencoded({ extended: true}))

// Middleware de gestion des cookie
const sessionParams = {
  secret: "my_secret",
  saveUninitialized: true,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};
app.use(session(sessionParams));


// Routes par defaut
app.use('/', defaultRoute)
app.use('/list', listRoutes)
app.use('/user', userRoute)
app.use("/api", apiRoute)
app.use('/task', taskRoutes)
app.use('/subTask', subTaskRoutes)


app.listen('3000', () => {
    console.log('Server started on port 3000');
  });

