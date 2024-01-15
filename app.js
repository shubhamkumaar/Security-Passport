import express from "express"
import bodyParser from "body-parser"
import "dotenv/config"
import session from "express-session"
import passport from "./auth/passport.js"
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import authRoutes from "./auth/router.js"
import isLoggedIn from "./auth/isAuthenticated.js"
import submitRoutes from "./routes/submit.js"
import db from "./database.js"
const app = express()
const port = 3000
const saltRounds = 12
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.use(session({
    secret:"Chota Secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req,res)=>{
   res.render("home.ejs")
});


app.use('/login',loginRoutes)
app.use('/register',registerRoutes)

// WHERE emails = $1",  AGAR sare user ka apna secret dikhana hai toh
  // [req.user.email],
app.get('/secrets',isLoggedIn,(req,res)=>{
  db.query("SELECT secrets FROM users" ,(err,result)=>{
    if(err){
      console.log(err)
    }
    if(result.rows != null){
      // console.log(result.rows)
      res.render('secrets.ejs',{userWithSecret : result.rows})
    }
    else{
      res.render('secrets.ejs')
    }
  })
})

app.use("/auth",authRoutes)

app.use("/submit",submitRoutes)
app.get('/logout',(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})


app.listen(port,()=>{
    console.log("Server Started")
})