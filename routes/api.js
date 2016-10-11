var moment = require('moment');
moment().format();

var MongoClient = require('mongodb').MongoClient,
    config = require('../config.json');
var callbackUrl = "http://localhost/oauth_callback";
var urldbevernote = 'mongodb://elecyrAdmin:zqpM1029@ds033933-a0.mongolab.com:33933,ds033933-a1.mongolab.com:33933/dbevernote?replicaSet=rs-ds033933'
                 
var dbArticleColl = 'articles';
var dbTagColl = 'tags';



// GET

exports.oauth_callback = function (req, res) {
  req.logger.log('info','1: (/oauth_callback) function entry');
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX
  });

  client.getAccessToken(
      req.session.oauthToken,
      req.session.oauthTokenSecret,
      req.param('oauth_verifier'),
      function(err, oauthAccessToken, oauthAccessTokenSecret, results) {
        req.logger.log('info','1: (/oauthAccessToken) function entry');
        if(err) {
          req.logger.log('error','1: (/oauthAccessToken) error ' + err);
          res.redirect('/');
        }
        else {
          req.logger.log('db','1: (/oauthAccessToken) Write file');
          fs.writeFile(__dirname + "/en_token.txt", oauthAccessToken, function(err) {
            if(err) {
              req.logger.log('error','1: (/oauth_callback) error ' + err);
              return
            }
            req.logger.log('db','1: (/oauthAccessToken) File saved <=> ' + __dirname + "/en_token.txt");
          });

          // store the access token in the session
          req.session.oauthAccessToken = oauthAccessToken;
          req.session.oauthAccessTtokenSecret = oauthAccessTokenSecret;
          req.session.edamShard = results.edam_shard;
          req.session.edamUserId = results.edam_userId;
          req.session.edamExpires = results.edam_expires;
          req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
          req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
          res.redirect('/');
        }
      }
  );
}
exports.oauth = function (req, res) {
  req.logger.log('info','1: (/oath) function entry');
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX
  });

  client.getRequestToken(callbackUrl, function(error, oauthToken, oauthTokenSecret, results){

    if(error) {
      req.session.error = JSON.stringify(error);
      res.redirect('/');
    }
    else {
      // store the tokens in the session
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;

      // redirect the user to authorize the token
      res.redirect(client.getAuthorizeUrl(oauthToken));
    }
  });
}
exports.posts = function (req, res) {
  
  var limit = (req.query.limit === "undefined")?9:parseInt(req.query.limit);
  
  var myFilter = (req.query.category) ? {categories: req.query.category} : {categories: { $exists: true}}; //set the default filter
  //var testFilter = {categories: req.query.category}
  //var myFilter = { $and: [ {filterDate: { $lt: req.query.dateRange}}, testFilter ]};

  //Modify The filter
  if(req.query.dateRange){
    var dateRange = req.query.dateRange;
    myFilter = { $and: [ {filterDate: { $lt: dateRange}}, myFilter ]};
  }

  var fetchEntries = function(db, callback){

    db.collection(dbArticleColl).find(myFilter).sort({filterDate:-1}).limit(limit).toArray(function(err, docs){
      callback(docs);
    })
    
  };

  MongoClient.connect(urldbevernote, function(err, db){
    fetchEntries(db, function(docs){
      db.close();

      var docs = docs.map(function(obj){
        obj.partialType =String(obj.partialType).replace(/solar-blog/g, 'blog');
        return obj;
      });
      res.send(docs);
    });
  });

};

exports.getPost = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};



exports.getTags = function (req, res) {

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

  MongoClient.connect(urldbevernote, function(err, db){
    getBlogTags(db, function(tags){
      db.close();
      res.send(tags);
    });
  });

};




