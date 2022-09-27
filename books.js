var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var router = express.Router();

function getGenres(res, mysql, context, complete){
  mysql.pool.query("SELECT genreID FROM Genres", function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.genre = results;
      complete();
  });
}



router.get('/books', function(req,res){
    var context = {};
    var callbackCount = 0;
    var mysql = req.app.get('mysql');
    mysql.pool.query("SELECT bookID, genreID, title, publisher, DATE_FORMAT(datePublished,'%c/%e/%Y') datePublished, copyAmount, amountAvailable, timesRented FROM Books", function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
      }
      context.books  = results;
      console.log(context);
      getGenres(res, mysql, context, complete)
      function complete(){
        callbackCount++;
        if(callbackCount >= 1){
          res.render('books', context);
        }
    }

  });
});

router.post('/books', function(req, res){
  console.log(req.body)
  var inserts;
  var sql;
  var mysql = req.app.get('mysql');
  if (req.body.genreID){
    sql = "INSERT INTO Books (genreID, title, publisher, datePublished, copyAmount, amountAvailable, timesRented) VALUES (?,?,?,?,?,?,?)";
    inserts = [req.body.genreID, req.body.title, req.body.publisher, req.body.datePublished,req.body.copyAmount, req.body.amountAvailable, req.body.timesRented]; 
    
  }
  else {
    sql = "INSERT INTO Books (title, publisher, datePublished, copyAmount, amountAvailable, timesRented) VALUES (?,?,?,?,?,?)";
    inserts = [req.body.title, req.body.publisher, req.body.datePublished,req.body.copyAmount, req.body.amountAvailable, req.body.timesRented]; 
  }
  
  sql = mysql.pool.query(sql,inserts,function(error, results, fields){
      if(error){
          console.log(JSON.stringify(error))
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.redirect('/books');
      }
  });
});

router.post('/books/search', jsonParser, function (req, res) {
    console.log(req.body);
    var context = {};
    var mysql = req.app.get('mysql');
    var searchField, searchInput;
    if (req.body.title) { searchField = "title"; searchInput = "'" + req.body.title + "'"; }
    if (req.body.publisher) { searchField = "publisher"; searchInput = "'" + req.body.publisher + "'"; }
    if (req.body.datePublished) { searchField = "datePublished"; searchInput = "'" + req.body.datePublished + "'"; }

    var searchQuery = "SELECT bookID, genreID, title, publisher, DATE_FORMAT(datePublished,'%c/%e/%Y') datePublished, copyAmount, amountAvailable, timesRented FROM Books WHERE " + searchField + " = " + searchInput;
    console.log(searchQuery);
    mysql.pool.query(searchQuery, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error));
            res.write(JSON.stringify(error));
            res.end();
        }
        context.books = results;
        console.log(context);
        res.render('books', context);
    });
});

router.post('/books/update', function (req, res) {
    console.log(req.body)
    var mysql = req.app.get('mysql');
    var sql = "UPDATE Books SET copyAmount = ?, amountAvailable = ?, timesRented = ? WHERE bookID = ?";
    var inserts = [req.body.copyAmount, req.body.amountAvailable, req.body.timesRented, req.body.bookID];
    sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
        if (error) {
            console.log(JSON.stringify(error))
            res.write(JSON.stringify(error));
            res.end();
        } else {
            res.redirect('/books');
        }
    });
});

module.exports = router;