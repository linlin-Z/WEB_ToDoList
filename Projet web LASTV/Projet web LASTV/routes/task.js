const express = require('express')
const router = express.Router();
const model = require("../models/tasks")

router.get("/:id", (req, res) =>{
    if (req.session.email == undefined){
      res.redirect("/")
    }
    else {
        model.getTaskInfos(req.params.id)
        .then(data => res.render("task", {task : data}))
    }
})

router.delete("/:id", (req, res) =>{
    model.deleteTask(req.params.id)
    res.end('task id : '+req.params.id+' deleted')
  })

router.post("", (req, res)=>{
    model.createTask(req.body)
    res.redirect("/list/user/"+req.session.userId)
  })

  // on update ici
router.post("/:id", (req, res) => {
  model.updateTask(req.params.id , req.body)
  res.redirect("/list/user/"+req.session.userId)
})

// router.patch("/:id", (req, res)=>{
//     model.updateTask(req.params.id , req.body)
//     res.end('task id : '+req.params.id+' patched')
//   })

router.get("/list/:listId", (req, res) => {
    if (req.session.email == undefined){
      res.redirect("/")
    }
    else {
      model.getTasksFromList(req.params.listId)
      .then(data => res.render("tasks", {tasks : data}))
    }
  
})

module.exports = router
