var express = require('express');
var router = express.Router();


var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

var url = 'mongodb://elecyrAdmin:zqpM1029@ds033933-a0.mongolab.com:33933,ds033933-a1.mongolab.com:33933/dbevernote?replicaSet=rs-ds033933'

var dbArticleColl = 'articles';
var dbTagColl = 'tags';

var callbackUrl = "http://localhost/myevernote/oauth_callback";


exports.getBlogSingle = function (req, res) {

  var getBlogTags = function(db, callback){

    db.collection(dbTagColl).find({'_id':1}).toArray(function(err, docs){

      var tagObject = {};
      tagObject = docs[0].tagObject;
      var tags = new Array();

      for(var key in tagObject){
        tags.push(tagObject[key]);
      }
      callback(tags);
    })
  };

  MongoClient.connect(url, function(err, db){
    getBlogTags(db, function(tags){
      db.close();

      res.render('blog/index', {
        title: "Solar Blog",
        menu_ctx: '',
        tags: tags
      });
    });
  });

};