var moment  = require('moment');
var  _      = require( 'lodash');
var low     = require('lowdb');

const db    = low('data/db.json',{ writeOnChange: false });
moment().format();



/*helper*/
function isLater(str1, str2)
{
  return new Date(str1) > new Date(str2);
}
/*helper*/

exports.posts = function (req, res) {
 var limit = (req.query.limit)?parseInt(req.query.limit):9,
     filterCategory = (req.query.category) ? req.query.category : 'All' ,
     dateRange = (req.query.dateRange)? req.query.dateRange : null,

     posts = db.get('articles').value();

      posts = _(posts).filter(function(post){

    /*filter category*/
    var filter1 = _.includes(post.categories, filterCategory);
    /*filter date*/


    var filter2 =   (dateRange)? (isLater(dateRange,post.filterDate)) : true;

    return filter1 && filter2 ;
  })

  /*limit*/
  posts = posts
        .take(limit)
        .value();

  var posts = posts.map(function(obj){
    obj.partialType =String(obj.partialType).replace(/solar-blog/g, 'blog')+'.html';
    return obj;
  });
  res.send(posts);
};

exports.getPost = function (req, res) {

  var id = (req.params.id)?req.params.id:null;
  if(!id){
    res.json({
      error:'Id not found'
    }).end();
  }
  var post = db
      .get('articles')
      .find({"_id":id})
      .value();
  if(post){
    res.json(post).end();
  }else {
    res.json({
      error:'post not found'
    }).end();
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


  var tags = db.get('tags').value();
  res.send(tags);
  /*


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
  });*/

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



