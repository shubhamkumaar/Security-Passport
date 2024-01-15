import passport from "passport"
import LocalStrategy from "passport-local"
import GoogleStrategy from "passport-google-oauth20"
import bcrypt from "bcrypt"
import db from "../database.js"
passport.use('local', new LocalStrategy({passReqToCallBack: true},(emails, passwords, cb )=> {
    db.query("SELECT id,emails, passwords FROM users WHERE emails=$1", [emails], (err, result) => {
        if(err){
            return cb(err);
        }
      
        if(result.rows.length > 0){
            const first = result.rows[0];
            bcrypt.compare(passwords, first.passwords, (err, res) => {
                if(res){
                    return cb(null,{
                      id:result.rows[0].id,
                      email:result.rows[0].emails
                    })
                }
                else {
                    return cb(null, false,{message:"Incorrect password"});
                }
            })
        }
        else {
            cb(null, false,{message:"Email Not Found"});
        }
    })
  }));
    // Working -->BOTH serial Deserial
  passport.serializeUser((user,done)=>{
    // console.log(user)
    done(null,{
      id:user.id,
      email:user.email
    })
  })
  passport.deserializeUser((user,done)=>{
    done(null,user)
  })
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Google Start")
    // console.log(profile)
    db.query("SELECT emails FROM users WHERE emails= $1", [profile.emails[0].value], (err, result) => { 
      if(err){
        return cb(err);
      }
      // console.log(result.rows.length)
      if(result.rows.length>0){
        // console.log("Already user")
        return cb(null,{
          id:profile.id,
          email:profile.emails[0].value
        })  
      }
      if(result.rows.length == 0){
        // console.log("Insert")
        db.query("INSERT INTO users (emails) VALUES ($1)",
        [profile.emails[0].value])
        return cb(null,profile)
      }
      
    })
  }));

  export default passport;