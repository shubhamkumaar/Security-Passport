export default function isLoggedIn(req,res,next){
    req.user ? next() :res.redirect('/')
  }