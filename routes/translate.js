var express = require('express');
var request = require('request');
var router = express.Router();
var config = require('config');
var MongoClient = require('mongodb').MongoClient;
 

function save(){
	// Connection URL 
	var url = 'mongodb://localhost:27017/translations';
	// Use connect method to connect to the Server 
	MongoClient.connect(url, function(err, db) {
	  // assert.equal(null, err);
	  console.log("Connected correctly to server");
	  

	  db.close();
	});
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  //call Yandex
  request.get('/')

  //cache Result
  save(translation)
  res.send('respond with a resource');
});

module.exports = router;
