var express = require('express');
var router = express.Router();
router.get('/libraryPatrons', function(req,res){
    var context = {};
    var mysql = req.app.get('mysql');
    mysql.pool.query("SELECT patronID, firstName, lastName FROM Library_Patrons", function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
      }
      context.patrons  = results;
      console.log(context);
      res.render('libraryPatrons', context);
  });
});

router.post('/libraryPatrons', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO Library_Patrons (firstName, lastName) VALUES (?,?)";
  var inserts = [req.body.firstName, req.body.lastName];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/libraryPatrons');
      }
  });
});

module.exports = router;
