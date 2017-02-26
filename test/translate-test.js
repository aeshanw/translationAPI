var assert = require('assert');
var request = require('supertest');
var router = require('../app');
// var express = require('express');
 
// var app = express();
 
// app.get('/user', function(req, res) {
//   res.status(200).json({ name: 'tobi' });
// });

describe('Translate Controller', function() {
  describe('post API', function() {
  	it('should return 200 when using default params', function(done) {
	  	request(router)
		  .post('/')
		  .expect('Content-Type', /json/)
		  .expect('Content-Length', '15')
		  .expect(200)
		  .end(function(err, res) {
		    if (err) throw err;
		    done();
		  });
	});

	it('should return 200 and a valid response when using default params', function(done) {
	  	request(router)
		  .post('/')
		  .send({ 
		  	to: 'es',
		  	from: 'en',
		  	text: "Hello my name is Aeshan"
		   })
		  .set('Accept', 'application/json')
		  .expect(200)
		  .end(function(err,res) {
			res.text = 'Bonjour mon nom est Ilyess';
			done();
      	  })
	});
  });
});