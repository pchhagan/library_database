var express = require('express');
var router = express.Router();
router.get('/authors', function(req,res){
    var context = {};
    var mysql = req.app.get('mysql');
    mysql.pool.query("SELECT authorID, firstName, lastName FROM Authors", function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
      }
      context.authors  = results;
      console.log(context);
      res.render('authors', context);
  });
});

router.post('/authors', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO Authors (firstName, lastName) VALUES (?,?)";
  var inserts = [req.body.firstName, req.body.lastName];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/authors');
      }
  });
});

module.exports = router;
