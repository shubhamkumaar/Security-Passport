import express from "express"
import isLoggedIn from "../auth/isAuthenticated.js";
import db from "../database.js"
const router  = express.Router();

router.get('/',isLoggedIn,(req,res)=>{
    res.render("submit.ejs")
  })
  
router.post('/',isLoggedIn,(req,res)=>{
    const Submitted_Secret = req.body.secret
    console.log(req.user.email)
    db.query("UPDATE users SET secrets = $1 WHERE emails = $2",
    [Submitted_Secret,req.user.email],(err,result)=>{
      res.redirect('/secrets')
    })
  })

export default router