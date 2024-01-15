import express from "express"
const router  = express.Router();
import passport from "passport";
router.get('/google',
   passport.authenticate('google',{scope:['email','profile']})
   
)
router.get('/google/secrets',
  passport.authenticate('google',{
    successRedirect: '/secrets',
    failureRedirect: '/auth/failure' ,
  })
);

router.get('/failure',(req,res)=>{
  res.send('Something went wrong')
})

export default router