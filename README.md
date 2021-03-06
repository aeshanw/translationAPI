# translationAPI
A translation API based off the Yandex API

##Installation

`git clone git@github.com:aeshanw/translationAPI.git`

`cd translationAPI`

`npm install`

###MongoDB
This application relies on mongoDB. Please follow the guide below.
https://docs.mongodb.com/manual/installation/

##Useage

`npm start`

visit http://localhost:3000/static/index.html

* Fill out form
 * select `en` on the `from` field  (English)
 * select `fr` on the `to` field (French)
 * Enter the text to be translated in the `text` textarea
 * Click the `Translate` button
* The translated result will appear below.


##Unit-tests

Tests can be run via mocha CLI

`npm install -g mocha`

`mocha test/translate-test.js`


##Code Coverage

Coverage can be computed using Istanbul if you wish:

`istanbul cover _mocha -- -R spec`