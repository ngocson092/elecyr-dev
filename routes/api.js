/*
 * Serve JSON to our AngularJS client
 */



var moment = require('moment');
moment().format();

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    config = require('../config.json');
var callbackUrl = "http://localhost/oauth_callback";
//mongodb://<dbuser>:<dbpassword>@ds033933-a0.mongolab.com:33933,ds033933-a1.mongolab.com:33933/<dbname>?replicaSet=rs-ds033933
var urldbevernote = 'mongodb://elecyrAdmin:zqpM1029@ds033933-a0.mongolab.com:33933,ds033933-a1.mongolab.com:33933/dbevernote?replicaSet=rs-ds033933'

var dbArticleColl = 'articles';
var dbTagColl = 'tags';


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





// GET

exports.updateBlog = function (req, res) {
  var currFunction = "/updateBlog";

  req.logger.log('info','1: (' + currFunction + ') function entry');

  var token;
  var allTags = {};

  //Read File for Auth Token and pass it into the evernote query
  req.logger.log('db','2: (' + currFunction + ') Read file <=> ' + __dirname + "/en_token.txt");
  fs.readFile(__dirname + "/en_token.txt", function(err, data) {
    if(err) {
      req.logger.log('error','3: (' + currFunction + ') read error ' + err);
      return;
    }

    token = data.toString();
    readEvernote(token);
  });

  //Full pull of the blog notebook
  function readEvernote(token){
    var currFunction = 'readEvernote';
    req.logger.log('info','1: (' + currFunction + ') function entry');

    var client = new Evernote.Client({
      token: token,
      sandbox: config.SANDBOX
    });

    var noteStore = client.getBusinessNoteStore();
    var userStore = client.getUserStore();



    /*
     *******************
     GET ALL TAGS
     *******************
     */
    noteStore.listTags(function(err, tags){
      if(err){
        //			req.logger.log('error','2: (' + currFunction + ') list tags error ' + err);
      }else{

        //Make a Name/Value Tag Object of only tags found in myCategories

        for(i=0;i<tags.length;i++){
          allTags[tags[i].guid] = tags[i].name;
        }
        //			req.logger.log('db', '3: noteStore.listTags: allTags{} Object returned from listTags call' + JSON.stringify(allTags, null, 4));
      }
    });

    userStore.getUser(function(err, user) {
      if(err){
        req.logger.log('error','4: (cb getUser) error ' + err);
      } else {
        //log.Write('program', "2:userStore.getUser");
        //log.Write('logs', "2:user" + user);

        client.listBusinessNotebooks(function(err, businessNotebook) {
          if(err){
            req.logger.log('error','5: (cb client.listBusinessNotebooks) businessNotebook error ' + err);
          } else{
            //log.Write('program', "client.listBusinessNotebooks");
            //log.Write('logs', "businessNotebook" + JSON.stringify(businessNotebook, null, 4));

            for(i=0;i<businessNotebook.length;i++){

              if(businessNotebook[i].guid=="c562380e-08cf-443f-844d-1a4740e15205"){

                //assign shardID for image retrieval
                var shardID = businessNotebook[i].shardId;

                client.getCorrespondingNotebook(businessNotebook[i], function(err, notebook) {
                  if(err){console.log("error first" + err)}

                  else{
                    //log.Write('program', "client.getCorrespondingNotebooks");
                    //log.Write('logs', "notebook" + JSON.stringify(notebook, null, 4));

                    filter = new Evernote.NoteFilter();
                    filter.notebookGuid = notebook.guid;

                    resultSpec = new Evernote.NotesMetadataResultSpec();
                    resultSpec.includeTitle=true;
                    resultSpec.includeAttributes=true;
                    resultSpec.includeTagGuids=true;

                    //Call for all notes in a given notebook
                    noteStore.findNotesMetadata(filter, 0, 20, resultSpec, function(err, items) {
                      if(err){ console.log(err + "this is the error");}

                      else{
                        //log.Write('program', "noteStore.findNotesMetadata")
                        //log.Write('logs', "items" + JSON.stringify(items, null, 4));
                        //console.log("these are the items" + JSON.stringify(items, null, 4));
                        getMy(items, function(blogTags){
                          updateTagDB(blogTags);
                        });
                      }
                    });
                  }
                });


              }
              else{
                //log.Write('error', "No Matched Notebooks");
              }
            }
          }
        });
      }
    });


//here




    function getMy(items, callback){

      var blogTags = {};

      //req.session.log = syslog;
      var loglevel = "funct";
      req.logger.log('info','1: (getMy) function entry');

      //	console.log("this is the items from with the function" + JSON.stringify(items, null, 4));

      userStore.getUser(function(err, edamUser){
        if(err){console.log('err' + err)}
        req.logger.log('info','2: (getMy) function entry');
        var myNotes = items.notes;
        req.logger.log('info','3: (getMy) function entry, Notes length: ' + myNotes.length);

        //For every note found in the Blog notebook make a noteStore.getNote call
        function loopNotes(j){
          if( j < myNotes.length ){
            req.logger.log('debug', '2: myNote: length' + myNotes.length);
            console.log("loop" + j);

            //object to hold the values for the given note
            var myDoc = {};
            noteStore.getNote(myNotes[j].guid, true, true, true, true,
                function(err, myNote){
                  req.logger.log('error','1: (getNote) function entry error: ' + err);
                  req.logger.log('db', '2: myNote' + JSON.stringify(myNote, null, 4));

                  if(err){
                    req.logger.log('error','3: (getNote) error notestore.getnote' + err);
                  } else {

                    var postMethod = myNote.attributes.source;
                    req.logger.log('error', '2: myNote: title ' + j + ' '  + myNote.title);

                    //Check the post type, Only excepting web.clip for now
                    if(postMethod==='web.clip' && myNote.tagGuids !== null){

                      //Assign the note properties that can be directly taken from the getNote callback
                      myDoc.guid = myNote.guid;
                      myDoc.title = myNote.title;
                      myDoc.author = myNote.attributes.lastEditedBy;
                      myDoc.sourceURL = myNote.attributes.sourceURL;
                      myDoc.title = myNote.title;
                      myDoc.created = moment(myNote.created).format("MMMM DD YYYY");

                      //variables that are needed for parsing information from the myNote object
                      var content = myNote.content;
                      var resources = myNote.resources;
                      var guid = myNote.guid;
                      var tagIDs = myNote.tagGuids;

                      //call the function to assign the real name of the tags to the article based on the tag IDs
                      var tagNames = tagArticle(tagIDs);
                      myDoc.tagNames = tagNames;

                      //Markup the header to use with bigText
                      var title = myNote.title;
                      var split = title.indexOf(" ", 40);
                      String.prototype.splice = function( idx, rem) {
                        return ('<div>' + this.slice(0,idx) + '</div> <div>' + this.slice(idx + Math.abs(rem)) + '</div>');
                      };

                      var bigtext = title.splice( split, 0)
                      myDoc.bigtext = bigtext;

                      req.logger.log('error', '2: myNote: bigtext ' + j + ' '  + myDoc.bigtext);

                      //Saves the images, Parses out the article body
                      parseMedia(content, resources, guid, function(content){
                        req.logger.log('db', '1: parseMedia: Callback:' + content);

                        myDoc.content = content;
                        dbContentUpdate(myDoc)
                        loopNotes(j + 1);
                      })
                    }
                    else{
                      req.logger.log('info','5: (getNote):: Article Posting Method: ' + postMethod + ' is not being accepted at thist time or the article has no tags');
                      loopNotes(j + 1);
                    }
                  }
                }
            )

            function tagArticle(tagIDs){

              var tagNames = new Array();

              //Bring first letter of all tag names to uppercase
              function toTitleCase(str)
              {
                return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
              }

              for(k=0;k<tagIDs.length;k++){
                //add the real name to the myDoc.tagName array
                req.logger.log('data', 'TAGS, this is tags[k]' + tagIDs[k]);

                var name = allTags[tagIDs[k]];
                req.logger.log('debug', 'Name' + name);
                var titleName = toTitleCase(name);
                req.logger.log('debug', 'titleName' + titleName);

                tagNames.push(titleName);

                //insert it into the blogtags db, for the bloghook make it only on new tags
                if(blogTags.hasOwnProperty('' + tagIDs[k] + '')){
                  req.logger.log('debug', 'Object tag ID already exists in object');
                }
                else {
                  blogTags[tagIDs[k]] = titleName;
                  req.logger.Write('db', 'this is the blogTags objects' + JSON.stringify(blogTags, null, 4));
                }
              }
              return tagNames;
            }

            function parseMedia(content, resources, guid, callback){
              req.logger.Write('info', '1: Entered parseMedia');
              //Write the Images to file
              for (var x=0; x < resources.length; x++) {
                console.log("media loop" + x);

                //Only the larger picture has a width property
                if(resources[x].width){

                  var filename = './public/images/' + guid + 'large';

                }
                else{

                  var filename = './public/images/' + guid + 'small';
                }

                //Write the Image to a file

                var wstream = fs.createWriteStream(filename);
                var array = [];
                for (var i = 0; i <= resources[x].data.size; i++) {
                  array.push(resources[x].data._body[i]);
                }
                // Create binary buffer
                var buffer = new Buffer(array);
                wstream.write(buffer);
                wstream.end();

              }


              //Parse out the body of the article
              $ = cheerio.load(content);
              var articleBody = $('div div:last-child div:last-child').text()

              req.logger.log('db', "2:parseMedia: article Body  " + articleBody);
              callback(articleBody)

            }


            function dbContentUpdate(myDoc){
              req.logger.Write('debug', "1: (dbContentUpdate) function entry");

              var updateDocument = function(db, callback){

                db.collection(dbArticleColl).update(
                    {_id:myDoc.guid},
                    { $set:
                    { content: myDoc.content,
                      title: myDoc.title,
                      bigtext: myDoc.bigtext,
                      categories:myDoc.tagNames,
                      sourceURL: myDoc.sourceURL
                    },
                      $setOnInsert: {
                        author:myDoc.author,
                        date:myDoc.created
                      }
                    },
                    { upsert: true},
                    function(err, result){
                      if(err){console.log("database error" + err)}
                      console.log("updated the blog");
                      callback(result);
                    }
                );
              }

              MongoClient.connect(urldbevernote, function(err, db){
                updateDocument(db, function(){
                  req.logger.Write('db', "Database Closed");
                  db.close();
                });
              });
            }
          }
          else{
            callback(blogTags);

          }
        }loopNotes(0)//closing tag for the loop myNotes.length
      });
    }
  }

  function updateTagDB(blogTags){
    req.logger.log('info', "Entered the updateTagDB function")


    var updateTags = function(db, callback){

      db.collection(dbTagColl).update(
          {_id:1},
          { $set:
          {
            tagObject: blogTags
          }
          },
          { upsert: true},
          function(err, result){
            if(err){console.log("database error" + err)}
            console.log("updated the tagDB");
            callback(result);
          }
      );
    }

    MongoClient.connect(urldbevernote, function(err, db){
      updateTags(db, function(){
        req.logger.Write('db', "Database Closed");
        db.close();
        res.render('updateSuccess', {
          title: "title"
        })
      });
    });

  }
}
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
  var fetchEntries = function(db, callback){
    db.collection(dbArticleColl).find().limit(limit).toArray(function(err, docs){
      callback(docs);
    })
  };

  MongoClient.connect(urldbevernote, function(err, db){
    fetchEntries(db, function(docs){
      db.close();
      res.send(docs);
    });
  });

};

exports.getPost = function (req, res) {
  var id = req.params.id;

  var fetchEntries = function(db, callback){
    db.collection(dbArticleColl).find({'_id':id}).toArray(function(err, docs){
      callback(docs);
    })
  };

  MongoClient.connect(urldbevernote, function(err, db){
    fetchEntries(db, function(docs){
      db.close();
      res.send(docs);
    });
  });

  /*var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }*/
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