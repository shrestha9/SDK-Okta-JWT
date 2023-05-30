var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.userContext) {
    const token=jwt.sign({name:req.userContext.userinfo.name},'secrect',{expiresIn:'1h'});
    res.render('index', { title: 'Welcome', user: req.userContext });
    
 } else {
    res.redirect('/login')
  }
});
module.exports = router;
