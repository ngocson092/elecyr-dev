var moment = require('moment');
moment().format();

var MongoClient = require('mongodb').MongoClient,
    config = require('../config.json'),
    Evernote = require('evernote').Evernote;
var callbackUrl = "http://localhost/oauth_callback";
var urldbevernote = 'mongodb://elecyrAdmin:zqpM1029@ds033933-a0.mongolab.com:33933,ds033933-a1.mongolab.com:33933/dbevernote?replicaSet=rs-ds033933'
                 
var dbArticleColl = 'articles';
var dbTagColl = 'tags';



// GET

exports.oauth_callback = function (req, res) {
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
        if(err) {
          res.redirect('/');
        }
        else {
   
          fs.writeFile(__dirname + "/en_token.txt", oauthAccessToken, function(err) {
            if(err) {
               return
            }
          });

          // store the access token in the session
          req.session.oauthAccessToken = oauthAccessToken;
          req.session.oauthAccessTtokenSecret = oauthAccessTokenSecret;
          req.session.edamShard = results.edam_shard;
          req.session.edamUserId = results.edam_userId;
          req.session.edamExpires = results.edam_expires;
          req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
          req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
          
          res.redirect('/evernote/notes');
        }
      }
  );
}
exports.oauth = function (req, res) {
  
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

exports.getNotes = function(req, res){

  var client = new Evernote.Client({token: req.session.oauthAccessToken});
  var noteStore = client.getNoteStore();
  
  

  notebooks = noteStore.listNotebooks(function(err, notebooks) {
    res.send(notebooks);
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





/*nimble api*/

var Nimble =  require('node-nimble-api');

Nimble.prototype.getContactById = function(id, callback) {

  var url = this.baseApi + '/contact/' + id;
  return this._get(url, function(err, result, response) {
    if(err) return callback(err);

    var res;
    try {
      res = JSON.parse(result);
    } catch(e) {
      err = e;
    }

    return callback(err, res, response);
  });
}



require('dotenv').load();
var nimble = new Nimble({
  appId: process.env.NIMBLE_APPID,
  appSecret: process.env.NIMBLE_APPSECRET
});

var nimble_url_callback  =  process.env.NIMBLE_URLCALLBACK;
exports.nimbleAuthorization = function (req, res) {
  res.redirect(nimble.getAuthorizationUrl({redirect_uri: nimble_url_callback}));
};

exports.nimbleCallback = function (req, res) {
  if(!req.query.error) {
    req.session.nimble_logined  =  req.query.code;
    res.redirect('/nimble/dashboard');
  } else {
    res.send('Error authenticating!!! -> ' + err);
  }
};
exports.nimbleDashboard = function (req, res) {
    res.render('nimble/dashboard');
};

exports.nimbleHome = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {
    res.redirect("/nimble/dashboard");
    return;
  }

   res.render('nimble/index');
};


exports.nimbleGetContacts = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {
    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {
      nimble.findContacts({}, function(err, result, response) {
        if(err) return res.send('ERROR' + JSON.stringify(err));
        var contacts = [];
        result.resources.forEach(function(r) {
          contacts.push(r)
        })
        res.send(contacts);
      });
    });
  }




};




exports.nimbleGetContactsId = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {

    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {
      nimble.findContactIds({}, function(err, result, response) {
        if(err) return res.send('ERROR' + JSON.stringify(err));
        var contact = [];
        result.resources.forEach(function(r) {
          contact.push(r)
        })
        res.send(contact);
      });
    });

  }//end if





};

exports.nimbleGetContactById = function (req, res) {
  var sess = req.session;
  if(sess.nimble_logined) {

    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {
      nimble.getContactById(req.params.id, function(err, result, response) {
        if(err) return res.send('ERROR' + err);
        var contact;
        result.resources.forEach(function(r) {
          contact = r;
        })
        res.send(contact);
      });
    });

  }//end if


};


exports.nimbleContactCreate = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {

    var firstname = req.body.firstname,
        lastname = req.body.lastname;

    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {
      nimble.createContact(
          {
            "fields": {
              "first name": [{
                "value": firstname,
                "modifier": ""
              }],
              "last name": [{
                "value": lastname,
                "modifier": ""
              }]
            },
            "type" : "person"
          }, function(err, result, response) {
            if(err) return res.send("ERROR" + JSON.stringify(err));
            return res.send(result);
          });


    });

  }//end if


};




exports.nimbleContactUpdate = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {

    var firstname = req.body.firstname,
        lastname = req.body.lastname;

    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {
      nimble.updateContact( req.params.id,
          {
            "fields": {
              "first name": [{
                "value": firstname,
                "modifier": ""
              }],
              "last name": [{
                "value": lastname,
                "modifier": ""
              }]
            }
          }, function(err, result, response) {
            if(err) return res.send("ERROR" + JSON.stringify(err));
            return res.send(result);
          });


    });

  }//end if


};

exports.nimbleContactDelete = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {

    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {
      nimble.deleteContact( req.params.id, function(err, result, response) {
            if(err) return res.send(err);
            return res.send(result);
      });
    });

  }//end if


};




exports.nimbleNoteCreate = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {
    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {
      var contact_id = req.params.id;
      nimble.listContactNotes(contact_id, function(err, results, response) {
       console.log(results);
      });

    });

  }//end if


};
exports.nimbleNoteList = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {

    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {


      nimble.createNote({
        "contact_ids": contact_id,
        "note": req.body.note,
        "note_preview": req.body.note_preview
      }, function(err, results, response) {
        return res.send('OK');
      });




    });

  }//end if
};



exports.nimbleTaskCreate = function (req, res) {

  var sess = req.session;
  if(sess.nimble_logined) {

    nimble.requestToken(sess.nimble_logined, function(err, access_token, refresh_token, result) {

      nimble.createTask({
        "related_to": req.body.id,
        "notes": req.body.notes,
        "subject": req.body.subject,
        "due_date": req.body.due_date
      }, function(err, results, response) {
        return res.send('OK');
      });


    });

  }//end if
};



/*nimble api*/

