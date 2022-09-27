var express = require('express');
var router = express.Router();
router.get('/genres', function(req,res){
    var context = {};
    var mysql = req.app.get('mysql');
    mysql.pool.query("SELECT genreID, name, isFiction FROM Genres", function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
      }
      context.genres  = results;
      console.log(context);
      res.render('genres', context);
  });
});

router.post('/genres', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO Genres (name, isFiction) VALUES (?,?)";
  var inserts = [req.body.name, req.body.radioB];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/genres');
      }
  });
});

module.exports = router;
