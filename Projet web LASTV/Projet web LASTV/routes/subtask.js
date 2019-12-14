
const express = require('express')
const router = express.Router();
const model = require("../models/subTasks")

router.get("/:id", (req, res) =>{
    model.getSubTaskInfos(req.params.id)
    .then(data => res.json(data))
  })

router.delete("/:id", (req, res) =>{
    model.deletesubTask(req.params.id)
    res.end('subtask id : '+req.params.id+' deleted')
  })

router.post("", (req, res)=>{
    model.createSubTask(req.body)
    res.end("subtask created")
  })

router.patch("/:id", (req, res)=>{
    model.updateSubTask(req.params.id , req.body)
    res.end('subtask id : '+req.params.id+' patched')
  })

router.get("/task/:taskId", (req, res) => {
    model.getSubTasksFromTask(req.params.taskId)
    .then(data => res.json(data))
})

module.exports = router
