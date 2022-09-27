var express = require('express');
var router = express.Router();

function getBooks(res, mysql, context, complete){
    mysql.pool.query("SELECT bookID FROM Books", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.book = results;
        complete();
    });
  }

  function getAuthor(res, mysql, context, complete){
    mysql.pool.query("SELECT authorID FROM Authors", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.author = results;
        complete();
    });
  }


router.get('/authoredworks', function(req,res){
    var context = {};
    var callbackCount = 0;
    var mysql = req.app.get('mysql');
    

    mysql.pool.query("SELECT * FROM Authors a INNER JOIN Authored_Works aw ON a.authorID = aw.authorID INNER JOIN Books b ON b.bookID = aw.bookID", function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
      }
      getAuthor(res, mysql, context, complete);
      getBooks(res, mysql, context, complete)
      context.works  = results;
      console.log(context);
      function complete(){
        callbackCount++;
        if(callbackCount >= 2){
          res.render('authoredworks', context);
        }
    }
  });
});

router.post('/authoredworks', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO Authored_Works (authorID, bookID) VALUES (?,?)";
  var inserts = [req.body.authorID, req.body.bookID];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/authoredworks');
      }
  });
});

router.get('/authoredworks/delete', function (req, res) {
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM Authored_Works WHERE authorID = ? AND bookID = ?";
    var inserts = [parseInt(req.query.authorID), parseInt(req.query.bookID)];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/authoredworks');
        }
    });
});

module.exports = router;