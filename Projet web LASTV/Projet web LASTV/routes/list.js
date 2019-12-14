
const express = require('express')
const router = express.Router();
const model = require("../models/lists")

// recupérer les infos d'une liste
// router.get("/:id", (req, res) => {
// 	if (req.session.email == undefined)
// 	{
// 		res.redirect("/")
// 	}
// 	else 
// 	{
// 			model.getListInfos(req.params.id)
// 			.then(data => res.render('list', {list : data}))
// 	}
// })

// recupérer les listes d'un user
router.get("/user/:id", (req, res)=>{
	if (req.session.email == undefined){
		res.redirect("/")
	}
	else {
			model.getListsByUser(req.params.id)
			.then((data) => {
				res.render("index", {lists : data, email: req.session.email})
			})
			.catch((err) => {
				// console.log(err)
			})
	}
})

router.delete("/:id", (req, res) =>{
	model.deleteList(req.params.id)
	res.end('list id :'+req.params.id+' deleted')
  })

router.post("/", (req, res)=>{
	model.createList(req.body, req.session.userId)
	res.redirect("/list/user/"+req.session.userId)
})

  // on update ici
router.post("/:id", (req, res)=>{
	model.updateList(req.params.id , req.body)
	// res.end('list id :'+req.params.id+' patched')
	res.redirect("/list/user/"+req.session.userId)
})

// router.patch("/:id", (req, res)=>{
// 	console.log("ici")
// 	console.log(req.body)
// 	// model.updateList(req.params.id , req.body)
// 	res.end('list id :'+req.params.id+' patched')
//   })
module.exports = router
