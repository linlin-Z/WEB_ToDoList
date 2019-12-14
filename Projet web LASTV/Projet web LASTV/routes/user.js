
const express = require('express')
const router = express.Router();
const model = require("../models/users")
const url = require('url');  
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elielevytest@gmail.com',
    pass: 'Elielevy92@'
  }
});


// router.get("/:id",(req, res) =>{
//   if (req.session.email == undefined){
// 		res.redirect("/")
// 	}
// 	else {
//       model.getUser(req.params.id)
//       .then(data => res.json(data))
//   }
//   })

router.delete("/:id", (req, res) =>{
    model.deleteUser(req.params.id)
    res.redirect("/")
  })

router.post("",(req, res)=>{
  // on doit verifier les données qui sont dans req.body
    const mailOptions = {
      from: 'elielevytest@gmail.com',
      to: req.body.email,
      subject: 'About the creation of your account...',
      text: 'Congrats! Your account has been created '+req.body.username+'.'
    }
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error)
        res.render("register", {message : "There must be a problem with your email..."})
      } else {
        // il doit se log in une fois son compte crée
        model.createUser(req.body)
        res.render("login", {message : ""})
      }
    });
  })

router.patch("/:id", (req, res)=>{
    model.updateUser(req.params.id , req.body)
    res.end('user id : '+req.params.id+' patched')
  })

// router.get("/list/:userid", (req, res) => {
//   model.getUserWithLists(req.params.userid)
//   .then(data => res.json(data))
// })

router.post("/changePassword/:userid", (req, res) => {
  model.changePassword(req.params.userid, req.body.newPassword)
  res.end("password of user id : "+req.params.userid+' changed')
})


router.get("/update", (req, res) => {
  if (req.session.email == undefined){
		res.redirect("/")
  }
  model.getUserInfos(req.session.userId)
  .then((data) => {
    if (data == null){
      res.redirect("/")
    }
    else {
      res.render("updateUser", {user : data, message : ''})
    }
  })
})

router.post("/update/send", (req, res) =>{
  const form = req.body
  const email = form.email
  model.checkIfEmailIsUsed(email, req.session.userId)
  .then((data) => {
    if (data != null){
      model.getUserInfos(req.session.userId)
      .then((data) => {
        res.render("updateUser", {user : data, message: "email deja pris..."})
      })
    }
    else {
        model.updateUser(req.session.userId, form)
        req.session.email = form.email
        res.redirect("/list/user/"+req.session.userId)
    }
  })
})


router.get("/delete", (req, res) => {
  if (req.session.username && req.session.userId){
    res.render('deleteUser', {message: "Veuillez vous identifier pour supprimer votre compte"})
  }
})

router.post("/delete", (req, res) => {
  const email = req.body.email
  const password = req.body.password

  model.findUserByEmailAndPassword(email, password)
  .then((data) => {
    if (data == null || data.dataValues.userid != req.session.userId){
      res.render("deleteUser", {message : "Bad Credentials"})
    }
    else{  
        model.deleteUser(data.dataValues.userid)
        req.session.userId = null
        res.redirect("/")
    }
  })
})

module.exports = router
