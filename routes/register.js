import express from "express"
const router  = express.Router();
import passport from "passport";
import bcrypt from "bcrypt";
import db from "../database.js"
var saltRounds = 12;
router.get("/",(req,res)=>{
    res.render("register.ejs")
})

router.post("/",async(req,res)=>{   
    // try{
      // console.log("post Register")
      const hashed = await bcrypt.hash(req.body.password,saltRounds);
      // console.log(hashed)
        const emails = req.body.username
        await db.query(
            "INSERT INTO users (emails,passwords) VALUES ($1,$2)",
            [emails,hashed] ,(err,user)=>{
              if(err){
                res.redirect('/register',{message:"Email Already exist"});
              }else{
                passport.authenticate("local")(req,res,()=>{
                  res.redirect("/secrets")
                })
              }
            }
        );            
    // }
    // catch(err){
    //   res.redirect('/register')
    // }
})

export default router