/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"
var data = {
  "posts": [
    {
      "title": "Lorem ipsum",
      "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      "title": "Sed egestas",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    }
  ]
};



var moment = require('moment');
moment().format();

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;

//mongodb://<dbuser>:<dbpassword>@ds033933-a0.mongolab.com:33933,ds033933-a1.mongolab.com:33933/<dbname>?replicaSet=rs-ds033933
    var urldbevernote = 'mongodb://elecyrAdmin:zqpM1029@ds033933-a0.mongolab.com:33933,ds033933-a1.mongolab.com:33933/dbevernote?replicaSet=rs-ds033933'

var dbArticleColl = 'articles';
var dbTagColl = 'tags';



//Fetch the blog Articles, this function makes an ajax call to database to get the content
router.get('/fetchArticles', function(req, res){

  req.logger.log('info','1: (/fetchArticles) function entry');

  var fetchEntries = function(db, callback){

    db.collection(dbArticleColl).find().toArray(function(err, docs){
      req.logger.log('db','2: (/fetchArticles) docs: ' + docs);
      callback(docs);
    })
  };

  MongoClient.connect(urldbevernote, function(err, db){
    fetchEntries(db, function(docs){

      db.close();

      res.send(docs);
    });
  });
})


//Call the 'blogs' collection from the mongoDB
router.get('/solar-blog', function(req, res){

  var getBlogTags = function(db, callback){

    db.collection(dbTagColl).find({'_id':1}).toArray(function(err, docs){
      //	console.log(docs);

      var tagObject = {};
      tagObject = docs[0].tagObject;
      //		req.logger.log('info', "The tagObject" + JSON.stringify(tagObject, null, 4));
      var tags = new Array();

      for(var key in tagObject){
        tags.push(tagObject[key]);
      }
      callback(tags);
    })
  };

  MongoClient.connect(urldbevernote, function(err, db){
    getBlogTags(db, function(tags){

      req.logger.log('db', "1: (tags) returned from database" + JSON.stringify(tags, null, 4));

      db.close();


      res.render('solar-blog', {
        title: "Solar Blog",
        tags: tags
      });
    });
  });
})


// GET

exports.posts = function (req, res) {
  var posts = [];
  data.posts.forEach(function (post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text.substr(0, 50) + '...'
    });
  });
  res.json({
    posts: posts
  });
};

exports.post = function (req, res) {
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