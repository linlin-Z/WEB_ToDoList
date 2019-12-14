
const express = require('express')
const router = express.Router();
const User = require("../models/users")
const List = require("../models/lists")
const Task = require("../models/tasks")
const Subtask = require("../models/subTasks")
const { check, validationResult } = require('express-validator/check');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'elielevytest@gmail.com',
    pass: 'Elielevy92@'
  }
});

/// USER /////

// recup les infos d'un user
router.get("/user/:userid", (req, res) =>{
  res.header("Access-Control-Allow-Origin", "*");
    User.getUserInfos(req.params.userid)
    .then(data => {
      const response = (data ==  null) ? {message : "Something went wrong. Are you sure "+req.params.userid+" is a valid user id ? "} : data
      res.json(response)
    })
  })

  //supprimer un user
router.delete("/user/:userid", (req, res) =>{
    User.deleteUser(req.params.userid)
    .then(rowDeleted => {
        const response = (rowDeleted === 1) ? 'Everything went fine. You deleleted 1 user with id '+req.params.userid : 'Something went wrong. Are your sure '+req.params.userid+' is a correct user id?'
        res.json({message : response})
  })
})

// creer un nouveau user
router.post("/user",
 [
  check('email').isEmail(),
  check('password').isLength({ min: 5 }),
  check('confirmedPassword').isLength({ min: 5 }),
  check('firstname').isLength({ min : 2}),
  check('lastname').isLength({ min : 2}),
  check('username').isLength({ min : 2})
],
 (req, res)=>{
       const errors = validationResult(req);
       if (!errors.isEmpty())
       {
          return res.json({ errors: errors.array() })
       }
        User.createUser(req.body)
        .then( () => {
          const mailOptions = {
            from: 'elielevytest@gmail.com',
            to: req.body.email,
            subject: 'About the creation of your account...',
            text: 'Congrats! Your account has been created'+req.body.username+'.'
          }
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              res.json(error)
            } else {
              res.json({message : "Everything is fine, you just created a user named "+req.body.username+"."})
            }
          });
        })
  })

  //Update User
router.patch("/user/:userid",
[
  check('email').isEmail(),
  check('firstname').isLength({ min : 2}),
  check('lastname').isLength({ min : 2}),
  check('username').isLength({ min : 2})
],
 (req, res)=>{
    User.updateUser(req.params.userid , req.body)
    .then(rowUpdated => {
      const response = (rowUpdated === 1) ? 'Everything went fine. You updated 1 user with id '+req.params.userid : 'Something went wrong. Are your sure '+req.params.userid+' is a correct user id?'
      res.json(response)
    })
  }
)

// changer le mdp d'un user
router.post("/user/changePassword/:userid", (req, res) => {
  User.changePassword(req.params.userid, req.body.newPassword)
  res.json({message : "password of user id : "+req.params.userid+' changed'})
})


  /// LIST ///

// recupérer les infos d'une liste
router.get("/list/:listid", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
	List.getListInfos(req.params.listid)
	.then(data => {
    const response = (data ==  null) ? {message : "Something went wrong. Are you sure "+req.params.listid+" is a valid listid ? "} : data
    res.json(response)
  })
})

// Recuperer les lists d'un user
router.get("/user/list/:userid", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  List.getListsByUser(req.params.userid)
  .then(data => { res.json(data)})
  .catch(err => { res.json({message :"Something went wrong. Are you sure "+req.params.userid+" is a valid id or owning any list ? " })})
})

// Supprimer une liste
router.delete("/list/:listid", (req, res) =>{
  List.deleteList(req.params.listid)
  .then(
    rowDeleted => {
      const response = (rowDeleted == 1) ? 'Everything went fine. You deleleted 1 list with id '+req.params.listid : 'Something went wrong. Are your sure '+req.params.listid+' is a valid list id?'
      res.json({message : response})
  })
})

router.post("/list", [
    check('name').isLength({min : 3}),
    check('description').isLength({min : 5})
],
  (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
      return res.json({ errors: errors.array() })
    }
    List.createList(req.body)
    .then(res.json({message : "Everything is fine, you just created a list named "+req.body.name+"."}))
})

router.patch("/list/:listid", (req, res)=>{
	List.updateList(req.params.listid , req.body)
	.then(rowUpdated => {
    const response = (rowUpdated == 1) ? 'Everything went fine. You updated 1 list with id '+req.params.listid : 'Something went wrong. Are your sure '+req.params.listid+' is a correct list id?'
    res.json({message : response})
})
  })


// TASKS ///

router.get("/task/:taskid", (req, res) =>{
  res.header("Access-Control-Allow-Origin", "*")
    Task.getTaskInfos(req.params.taskid)
    .then(data => {
      const response = (data ==  null) ? {message : "Something went wrong. Are you sure "+req.params.taskid+" is a valid task id ? "} : data
      res.json(response)
    })
  })

router.delete("/task/:taskid", (req, res) =>{
    Task.deleteTask(req.params.taskid)
    .then(rowDeleted => {
      // console.log("tache supprimée")
      const response = (rowDeleted == 1) ? 'Everything went fine. You deleleted 1 task with id '+req.params.taskid : 'Something went wrong. Are your sure '+req.params.taskid+' is a valid task id?'
      res.json({message : response})
  })
  })

router.post("/task",
[
  check("name").isLength({min : 3}),
  check('description').isLength({min : 5})
],
 (req, res)=>{
  res.header("Access-Control-Allow-Origin", "*");
  const errors = validationResult(req);
  if (!errors.isEmpty())
  {
     return res.json({ errors: errors.array() })
  }
  List.isList(req.body.listid)
  .then(data => {
    if (data == null){
      res.json({message : "Something went wrong, are you sure "+req.body.listid+" is a valid list id? "})
    }
  })
  .then(() => {
    Task.createTask(req.body)
    .then(res.json({message : "Everything is fine, you just created a task named "+req.body.name+"."}))
  })
})

router.patch("/task/:taskid", (req, res)=>{
    Task.updateTask(req.params.taskid , req.body)
    .then(rowUpdated => {
      const response = (rowUpdated == 1) ? 'Everything went fine. You updated 1 task with id '+req.params.taskid : 'Something went wrong. Are your sure '+req.params.taskid+' is a correct task id?'
      res.json({message : response})
  })
  })

router.get("/task/list/:listid", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
    Task.getTasksFromList(req.params.listid)
    .then(data => {
      const response = data
      res.json(response)
    })
})

// SUBTASKS ///


router.get("/subtask/:subtaskid", (req, res) =>{
  res.header("Access-Control-Allow-Origin", "*");
    Subtask.getSubTaskInfos(req.params.subtaskid)
    .then(data => {
      const response = (data ==  null) ? {message : "Something went wrong. Are you sure "+req.params.subtaskid+" is a valid subtask id ? "} : data
      res.json(response)
    })
  })

router.delete("/subtask/:subtaskid", (req, res) =>{
    Subtask.deletesubTask(req.params.subtaskid)
    .then(rowDeleted => {
      const response = (rowDeleted == 1) ? 'Everything went fine. You deleleted 1 subtask with id '+req.params.subtaskid : 'Something went wrong. Are your sure '+req.params.subtaskid+' is a valid subtask id?'
      res.json({message : response})
  })
  })

router.post("/subtask", [
  check("name").isLength({min : 3}),
  check("description").isLength({min : 5})
],
(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
       return res.json({ errors: errors.array() })
    }
    Task.isTask(req.body.taskid)
    .then(data => {
      if (data == null){
        res.json({message : "Something went wrong, are you sure "+req.body.taskid+" is a valid task id? "})
      }
    })
    .then( () => {
      Subtask.createSubTask(req.body)
      res.json({message : "subtask named "+req.body.name+" created"})
    })
  })

router.patch("/subtask/:subtaskid", (req, res)=>{
    Subtask.updateSubTask(req.params.subtaskid , req.body)
    .then( rowUpdated => {
      const response = (rowUpdated == 1) ? 'Everything went fine. You updated 1 subtask with id '+req.params.subtaskid : 'Something went wrong. Are your sure '+req.params.subtaskid+' is a correct subtask id?'
      res.json({message : response})
  })
})

router.get("/subtask/task/:taskid", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
    Subtask.getSubTasksFromTask(req.params.taskid)
    .then(data => {
      const response = (data.length == 0) ? "Something went wrong. Are you sure "+req.params.taskid+" is a valid task id or contains any subtasks? " : data
      res.json(response)
    })
})



module.exports = router
