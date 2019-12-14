const express = require('express')
const router = express.Router();
const url = require('url');  
const model = require("../models/users")

router.get("/", (req, res) =>{
    if (req.session.username && req.session.userId){
        res.redirect("/list/user/"+req.session.userId)
    }
    else{
        let message = req.query.message ? req.query.message : "";
        res.render('login', {message: message})
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

router.post("/login/send", (req, res) =>{
    const form = req.body
    const email = form.email
    const password = form.password
    model.findUserByEmailAndPassword(email, password)
    .then((data) =>
    {
        if (data == null){
            res.redirect(url.format({
                        pathname:"/",
                        query: {
                           "message": "Invalid Password or Email",
                         }
            }));
        }
        else {
            userFound = data.dataValues
            req.session.userId = userFound.userid
            req.session.username = userFound.username
            req.session.email = userFound.email
            res.locals.username = userFound.username
            res.redirect("/list/user/"+req.session.userId)
        }
    })
})

router.get("/register", (req, res) =>{
    res.render('register', {message : ""})
})

router.post("/register/send", (req, res) =>{
    const form = req.body
    const email = form.email
    // checker si email existe deja
    model.getUserInfosByEmail(email)
    .then((data) =>  {
        if (data != null){
            res.render("register", {message : "This Email is already used."})
        }
    })

    if (form.password != form.confirmed_password){
        res.render("register", {message : "Passwords do not match."})
    }
    // pour rediriger avec le meme req.body sur une autre methode post
    res.redirect(307, "/user")
})

router.get("/forgotPassword", (req, res) =>{
})



module.exports = router
