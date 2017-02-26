var express = require('express');
var request = require('request');
var router = express.Router();
var config = require('config');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var url = require('url');
 

var dbConnect = function(callback){

    var dbConfig = config.Translation.dbConfig;
	// Connection URL 
	var url = 'mongodb://'+dbConfig.host + ':' + dbConfig.port +'/' + dbConfig.dbName;
	// Use connect method to connect to the Server 
	MongoClient.connect(url, function(err, db) {
	  // assert.equal(null, err);
	  console.log("Connected correctly to server");
	  callback(err,db);
	});
}

var findTranslation = function(db, guid, callback){
    var collection = db.collection(config.Translation.dbConfig.dbCollection);

    collection.findOne({guid: guid},function(err,result){
        if(err){
            console.log("findTranslation ERROR occured: %j",err);
        }
        callback(err,result);
    });
}

var saveTranslation = function(db, translation, callback) {
  // Get the documents collection 
  var collection = db.collection(config.Translation.dbConfig.dbCollection);
  // Insert some documents 
  collection.insertOne(translation,function(err,result){
    if(!err){
        console.log("Inserted 1 documents into the collection");
    }
    callback(err, result);
  });
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {

	var params = {
		key: config.Translation.yandex.apiKey,
		text: "Hello my name is Ilyess",
		lang: 'en-fr'
	};

	//override with params
    if(req && req.body){
	  console.log('req.body: %j', req.body);
	  params.text = req.body.text;
	  if(req.body.to && req.body.from){
        params.lang = req.body.from + '-' + req.body.to;
	  }

	}else{
	  console.warn('NO req.body!');
	}

     //generate a unique hash of the request
     var strHash = crypto.createHash('sha256').update(params.lang + params.text).digest('hex');
     console.log('Generate unique guid:'+strHash);

    dbConnect(function(err,db){  

    //check for existing translation
    findTranslation(db, strHash, function(err, result){
        console.log('find results: %j', result);
        if(result && result.srcText){
            //prior translation found!
            res.json({
                text:result.desText
            });
            db.close();
        }else{
            //no prior translation found

             //call Yandex
              var queryStrings = querystring.stringify(params);
              request.post('https://translate.yandex.net/api/v1.5/tr.json/translate?'+queryStrings,function(err, response, body){
                console.log('response: %j',response);
                var bodyText = JSON.parse(body);
                if(response.statusCode > 200){
                    res.status(response.statusCode).send(body);
                    db.close();
                }else{
                   // console.log('bodyText: %j',bodyText);
                  //cache Result
                  var translation = {
                    guid: strHash,
                    lang: params.lang,
                    srcText: params.text,
                    desText: bodyText.text[0]
                  };

                  //cache the translation for future calls
                  saveTranslation(db, translation, function(err, result){
                    res.json({text: translation.desText});
                    db.close();
                  });
                }
              });
        }
    });

  });
});

module.exports = router;
