var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
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

  function getPatrons(res, mysql, context, complete){
    mysql.pool.query("SELECT patronID FROM Library_Patrons", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.patron = results;
        complete();
    });
  }


router.get('/activeLoans', function(req,res){
    var context = {};
    var callbackCount = 0;
    var mysql = req.app.get('mysql');
    mysql.pool.query( "SELECT loanID, b.bookID, b.title, a.firstName, a.lastName, a.patronID, DATE_FORMAT(returnDate,'%c/%e/%Y') returnDate, isOverdue FROM Library_Patrons a INNER JOIN Active_Loans aw ON a.patronID = aw.patronID INNER JOIN Books b ON b.bookID = aw.bookID", function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
      }
      context.loans  = results;
      console.log(context);
      getBooks(res, mysql, context, complete);
      getPatrons(res, mysql, context, complete);
      function complete(){
        callbackCount++;
        if(callbackCount >= 2){
          res.render('activeLoans', context);
        }
    }
  });
});

router.post('/activeLoans', function(req, res){
  console.log(req.body)
  var mysql = req.app.get('mysql');
  var sql = "INSERT INTO Active_Loans (bookID, patronID, returnDate) VALUES (?,?,?)";
  var inserts = [req.body.bookID, req.body.patronID, req.body.returnDate];
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/activeLoans');
      }
  });
});

router.post('/activeLoans/update', function (req, res) {
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Active_Loans SET returnDate = ?, isOverdue = ? WHERE loanID = ?";
    var inserts = [req.body.returnDate, req.body.isOverdue, req.body.loanID];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/activeLoans');
        }
    });
});

router.get('/activeLoans/delete', function (req, res) {
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM Active_Loans WHERE loanID = ?";
    var inserts = [parseInt(req.query.loanID)];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/activeLoans');
        }
    });
});

 router.post('/activeLoans/search', jsonParser, function(req,res){
     console.log(req.body);
     var context = {};
     var mysql = req.app.get('mysql');
     var searchField, searchInput;
     if (req.body.loanID) { searchField = "loanID"; searchInput = req.body.loanID;} 
     if (req.body.bookID) { searchField = "bookID"; searchInput = req.body.bookID; }
     if (req.body.patronID) { searchField = "patronID"; searchInput = req.body.patronID; }
     if (req.body.returnDate) { searchField = "returnDate"; searchInput = "'" + req.body.returnDate + "'"; }
     if (req.body.radioA) { searchField = "isOverdue"; searchInput = req.body.radioA; }

     var searchQuery = "SELECT loanID, bookID, patronID, DATE_FORMAT(returnDate,'%c/%e/%Y') returnDate, isOverdue FROM Active_Loans WHERE " + searchField + " = " + searchInput; 
     console.log(searchQuery); 
     mysql.pool.query(searchQuery, function(error, results, fields){
       if(error){
           console.log(JSON.stringify(error));
           res.write(JSON.stringify(error));
           res.end();
       }
       context.loans  = results;
       console.log(context);
       res.render('activeLoans', context);
   });
 });

module.exports = router;
