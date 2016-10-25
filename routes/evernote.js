var express = require('express');
var path = require('path');
var router = express.Router();

var Evernote = require('evernote').Evernote;
var config = require('../config.json');

require('dotenv').load();

var fs = require('fs');
var cheerio = require('cheerio');

var moment = require('moment');
moment().format();

var MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;
var assert = require('assert')
	                
var url = 'mongodb://sonlexus:123qwe123@ds061676.mlab.com:61676/elecry';

var dbArticleColl = 'articles';
var dbTagColl = 'tags';

/*
	Live notebook guid is c562380e-08cf-443f-844d-1a4740e15205
	Sandbox notebook guid is 0eb2a276-bce2-4702-853b-90ec8b31a5f3
	
*/

var callbackUrl = `${process.env.DOMAIN}:${process.env.PORT}/evernote/oauth_callback`;

router.get('/info', function (req, res) {
    res.render('updateSuccess', {
		title:'Modular test success'
	})
});

/*********************

  Authorization Routes
  
***********************/

router.get('/oauth', function(req, res) {

	//req.logger.log('info','1: (/oath) function entry');
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
});



router.get('/oauth_callback', function(req, res) {
	//req.logger.log('info','1: (/oauth_callback) function entry');
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
			//req.logger.log('info','1: (/oauthAccessToken) function entry');
			if(err) {
				//req.logger.log('error','1: (/oauthAccessToken) error ' + err);
				res.redirect('/');
			} 
			else {		
				//req.logger.log('info','1: (/oauthAccessToken) Write file');
				fs.writeFile("en_token.txt", oauthAccessToken, function(err) {
				if(err) {
					//req.logger.log('error','1: (/oauth_callback) error ' + err);
					return
				}
				//req.logger.log('info','1: (/oauthAccessToken) File saved <=> ./../en_token.txt');
				});

				// store the access token in the session
				req.session.oauthAccessToken = oauthAccessToken;
				req.session.oauthAccessTtokenSecret = oauthAccessTokenSecret;
				req.session.edamShard = results.edam_shard;
				req.session.edamUserId = results.edam_userId;
				req.session.edamExpires = results.edam_expires;
				req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
				req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
				res.redirect('/evernote/updateBlog');
			}
		}
	);
});

/**********************************

Calling and Receiving Blog updates

***********************************/

var allTagNames = new Array(); //Array that holds all of the blog posts' tag names

/* GET Evernote Updates Manually*/
router.get('/updateBlog', function(req, res, next) {

	var currFunction = "/updateBlog";	
	//req.logger.log('info','1: (' + currFunction + ') function entry');
		
	var token;
	var allTags = {};






	
	/*
	*******************		
		Get the token required to call evernote			
	*******************
	*/
	fs.readFile("en_token.txt", function(err, data) {	
		if(err) {
			//req.logger.log('error','3: (' + currFunction + ') read error ' + err);
			return;
		}
		
		token = data.toString();
		var client = new Evernote.Client({token: token});
		var noteStore = client.getBusinessNoteStore();

		client.listBusinessNotebooks(function(err, businessNotebook) {
			if(err){
				res.send(businessNotebook);
			}else{
				res.send(businessNotebook);

			}
		})


		return ;


		//readEvernote(token);
	});

	
	
	/*
	*******************		
		Make Call to evernote			
	*******************
	*/
	function readEvernote(token){
		var currFunction = 'readEvernote';
		//req.logger.Write('data','1: (' + currFunction + ') function entry');
								
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
				//req.logger.log('error','2: (' + currFunction + ') list tags error ' + err);
			}else{

				//Make a Name/Value Tag Object of only tags found in myCategories
								
				for(i=0;i<tags.length;i++){
					allTags[tags[i].guid] = tags[i].name;
				}
	//			//req.logger.log('db', '3: noteStore.listTags: allTags{} Object returned from listTags call' + JSON.stringify(allTags, null, 4));
			}
		});
		
		/*
		*******************		
			GET All the Notes			
		*******************
		*/
		
		userStore.getUser(function(err, user) {
			if(err){
				//req.logger.Write('error','4: (cb getUser) error ' + err);
			} else {
				//req.logger.Write('data', "2:userStore.getUser");
				
				client.listBusinessNotebooks(function(err, businessNotebook) {
					res.send(businessNotebook);return;


					if(err){
						//req.logger.log('error','5: (cb client.listBusinessNotebooks) businessNotebook error ' + err);
					} else{
						//req.logger.log('data', "client.listBusinessNotebooks");
					
						for(i=0;i<businessNotebook.length;i++){	
							//req.logger.log('info', "8: businessNotebook.length 8: This is the notebook guid" + businessNotebook[i].guid)
						
							if(businessNotebook[i].guid=="0eb2a276-bce2-4702-853b-90ec8b31a5f3"){
												
								var shardID = businessNotebook[i].shardId;    //assign shardID for image retrieval
								
								client.getCorrespondingNotebook(businessNotebook[i], function(err, notebook) {	
									if(err){
										//req.logger.log('error', "error first" + err)
									}
																				
									else{
										//req.logger.log('data', "client.getCorrespondingNotebooks");	
										
										filter = new Evernote.NoteFilter();
										filter.notebookGuid = notebook.guid;

										resultSpec = new Evernote.NotesMetadataResultSpec();
										resultSpec.includeTitle=true;
										resultSpec.includeAttributes=true;
										resultSpec.includeTagGuids=true;

										//Call for all notes in a given notebook
										noteStore.findNotesMetadata(filter, 0, 15, resultSpec, function(err, items) {
											//req.logger.log('data', "noteStore.findNotesMetadata")
										
											if(err){ 
												//req.logger.log('error', err + "this is the error");
												}
																						
											else{
												//Define the global blog tag array here.
												var myNotes = items.notes;
												
												allTagNames = []; //clear the array
												
												function loopNotes(j){
													if( j < myNotes.length ){
														//req.logger.log('data', "This is the " + j + " loop");
														var noteGuid = myNotes[j].guid;
														
														makeNoteObj(noteGuid, noteStore, userStore, allTags, req, function(myDoc){
																													
															if(myDoc == "invalid"){
																loopNotes(j + 1);
															}else{
																dbContentUpdate(myDoc, req);
																loopNotes(j + 1);
															}
															
														});
														
													}
													else{

														//req.logger.log('data', "This is j " + j + " And this is the end");
														updateTagDB(allTagNames, req, res);
													}
												}loopNotes(0)//closing tag for the loop myNotes.length
											}
										});
									}									
								});
							
							
							}
							else{
								//req.logger.Write('error', "Notebook was not a match");
							}
						}
					}
				});
			}			
		});	// Userstore getUser - Closing Tag					
	} //function readEvernote() - Closing Tag		
}); //Route - Closing Tag



/* GET Evernote Updates Automatically */
router.get('/blogHook', function(req, res, next) {
	
	var currFunction = "/blogHook";
		
	//req.logger.log('info','1: (' + currFunction + ') function entry' + req.query.guid);
	
	var vars = {};
	var noteGuid = req.query.guid;
	
	clearTimeout(vars['timer' + noteGuid]);
    vars['timer' + noteGuid] = setTimeout(function(){
        updateFinished(noteGuid)}, 20000);
		
	function updateFinished(noteGuid){	
	
		
		var token;
		var allTags = {}; //object that will hold all the tagID/Name pairs
		allTagNames = []; //clear the array of all tags
		
			fs.readFile("en_token.txt", function(err, data) {	
			if(err) {
				//req.logger.log('error','3: (' + currFunction + ') read error ' + err);
				return;
			}
			
			token = data.toString();
			readEvernote(token);
		});
		
		
		
		function readEvernote(token){
			var currFunction = 'readEvernote';
			//req.logger.Write('info','1: (' + currFunction + ') function entry');
									
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
					//req.logger.log('error','2: (' + currFunction + ') list tags error ' + err);
				}else{
													
					for(i=0;i<tags.length;i++){
						allTags[tags[i].guid] = tags[i].name;
					}
		//			//req.logger.log('info', '3: noteStore.listTags: allTags{} Object returned from listTags call' + JSON.stringify(allTags, null, 4));
				}
			});
			
			userStore.getUser(function(err, user) {
				if(err){
					//req.logger.Write('error','4: (cb getUser) error ' + err);
				} else {
					makeNoteObj(noteGuid, noteStore, userStore, allTags, req, function(myDoc){
						if(myDoc == "invalid"){
							res.end();
						}else{
							dbContentUpdate(myDoc, req);
							updateTagDB(allTagNames, req, res);
						}
					});
				}
			})
		}	
	}
});




function makeNoteObj(noteGuid, noteStore, userStore, allTags, req, noteCallback){
	//req.logger.log('data','1: makeNoteObj function entry');
	
	userStore.getUser(function(err, edamUser){
			
		if(err){
			 //req.logger.Write('error', 'err' + err)
			// 
		}
		
		var myDoc = {}; //Object that will hold all the note information that will be inserted into the DB
		
		noteStore.getNote(noteGuid, true, true, true, true, 
			function(err, myNote){
				if(err){
					//req.logger.log('error','3: (getNote) error notestore.getnote' + err);
				}
								
				var postMethod = myNote.attributes.source; //get what kind of evernote note it is
				
				//Continue as long as it is not of the type web.clip and the note has tags
				if(myNote.tagGuids !== null && postMethod !== 'web.clip'){
					//req.logger.log('db','1.5 this is the note attrbutes value' + JSON.stringify(myNote.attributes, null, 4))
					//req.logger.log('info','2: Post has tags and is not a webclip: Assinging values to myDoc');
					
					/* postTitle true indicates a duplicate title
					*/
					var postBody = myNote.content;
					$ = cheerio.load(postBody);
					if($('h1').index() === 0){
						var postTitle = true;
						var title = $('h1').text();
						$('h1').remove();
						var content = $.html();
					}else{
						var postTitle = false;
						var title = myNote.title;
						var content = myNote.content;
					}
						
		/*			var postTitle = ($('h1').index() === 0) ? true : false; //set post title to true
					var title = ($('h1').index() === 0) ? $('h1').text() : myNote.title; //If the duplicate is true then set it to the value of the title
					
					//var content = ($('h1').index() === 0) ? $('h1').remove() : myNote.content; //remove the duplicate title from the body if it is true
					$('h1').remove();
					//req.logger.log('error', "this is the contentTest" + $.html());
									
					/*Assign values to the parameters passed into parseContent
					
					var content = myNote.content;*/
					//req.logger.log('error', "this is the content" + content);
					
					var resources = myNote.resources;
					var guid = myNote.guid;
					
					
					/*Replace the spaces in the title with dashes to be used as URL links for seo purposes
					*/
					

					var dashedTitle = title.replace(/\W+/g, " ")
					var dashedTitle = dashedTitle.replace(/ /g, "-");
					
					/* Grab the tag names and use them for additional functionality
					*/
					var tagIDs = myNote.tagGuids;
					var tagNames = tagNamesFunction(tagIDs, allTags, req);
					myDoc.tagNames = tagNames;
					
					
					/* Check for the delete Tag and call the delete function
					*/
					var shouldDelete = (tagNames.indexOf(".Delete") > -1);

					if(shouldDelete){
						deletePost(guid, req) // call the delete function						
						noteCallback("invalid"); 
					}
					else{         //Continute if no delete tag is found
										
						myDoc.guid = myNote.guid;
						myDoc.title = title;
						myDoc.displayDate = moment(myNote.created).format("MMMM DD YYYY");
						myDoc.postSource = myNote.attributes.sourceURL; //url of the original article
						myDoc.author = myNote.attributes.author;
												
						/* Check for the .top tag, If it exists then add 20 years to the creation date, pushing the post to the top
						*/
						//req.logger.log('info','7777 This is the tag names array' + JSON.stringify(tagNames, null, 4));
						var topList = (tagNames.indexOf(".Top") > -1);
						if(topList){
							myDoc.filterDate = moment(myNote.created).add(20, 'y').format();
						}else{
							myDoc.filterDate = moment(myNote.created).format();
						}
																				
						//call the function to save the partial type, the text body and the headline image and then call the callback from here
						parseContent(content, resources, guid, req, dashedTitle, function(content, partialType, target, headlineImage){
							
							myDoc.content = content;
							myDoc.partialType = partialType;
							myDoc.target = target;
							myDoc.headlineImage = headlineImage;
							
							noteCallback(myDoc)
							
						});
					}
					
				}
				else{
					//req.logger.log('info','2: (getNote):: Article Posting Method: ' + postMethod + ' is not being accepted at thist time or the article has no tags');
					noteCallback("invalid"); 
				}
			}			
		)
	}) //userStore.getUser - Closing Tag
} //makeNoteObj - Closing Tag

/*Get the post's tag names based on their tag IDs
*/
function tagNamesFunction(tagIDs, allTags, req){					
	//req.logger.Write('info', '1: Entered tagNames');
	
	var tagNameArray = new Array();
				
	//Bring first letter of all tag names to uppercase
	function toTitleCase(str)
		{
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	
	for(k=0;k<tagIDs.length;k++){
		//add the real name to the myDoc.tagName array
		//req.logger.log('data', 'TAGS, this is tags[k]' + tagIDs[k]);
		
		var name = allTags[tagIDs[k]];
		//req.logger.log('debug', 'Name' + name);
		var titleName = toTitleCase(name);

		//req.logger.log('debug', 'titleName' + titleName);
	
		
		tagNameArray.push(titleName); // Array of the individiual posts tags
			
		//If the tag does not begin with a period add it to the global tag array
		if(titleName.match(/^./)){	
			//req.logger.Write('info', '1: the tag Begins with a period and so will not be added to the tag DB');
		}else{
			allTagNames.push(titleName); //Defined outside of the route - An array of all the tags, to be inserted in tag db
		}
	}
	
	return tagNameArray;
}

/*If the note has resources
	1. Write the PDFs and images to a file
	2. Replace the ENML images for HTML images
	3. Assign the headline Image for the main post gallery
*/
function parseContent(content, resources, guid, req, dashedTitle, parseCallback){
	//req.logger.Write('info', '1: Entered parseContent');
	
	var partialType =  "/solar-blog/link/" + dashedTitle;//Default partialType (Dictates which partial file is used for the note template)
	var target;
	var headlineImage;
	
	if(resources === null){
		//req.logger.Write('info', '1: Resources Undefined');
	}
	else{
		var imgCount = 0; //Different increment variable to keep Image references and file names congruent
		
		for (var x=0; x < resources.length; x++) {
			
			if(resources[x].mime == 'application/pdf'){
				
				var filename = './public/pdfs/' + dashedTitle + '.pdf';
				
				//change the angular route source here from the default
				partialType = 'http://elecyr.com/pdfs/' + dashedTitle + '.pdf';
				target = "_self"; //Allow PDF links to escape AngularJS default routing
			
			}else{
				var filename = './public/images/solar-blog/' + dashedTitle + '_' + imgCount + '_';
				//replace all evernote images with html images
				content = content.replace(/<en-media/, '<img src="/images/solar-blog/' + dashedTitle + '_' + imgCount + '_"');
	
				//Image displayed on the menu page will be the first in the list of resources
				headlineImage = "<img src='/images/solar-blog/" + dashedTitle + "_0_' />";
				imgCount++;
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
		
		
	}
	//$ = cheerio.load(content);
	//	var articleBody = $('div').text()
	//	var articleHeader = $(':header').text();
	//	//req.logger.Write('debug', "THis is the article body " + articleBody + " This is the article Header" + articleHeader);
		
	parseCallback(content, partialType, target, headlineImage);
} // parseContent - Closing Tag

/*Insert the post into the articles database
*/

function dbContentUpdate(myDoc, req){
	//req.logger.Write('data', "1: (dbContentUpdate) function entry");
	
	var updateDocument = function(db, callback){

		db.collection(dbArticleColl).update(
			{_id:myDoc.guid},
			{ $set: 
				{ snippet: myDoc.content,
				  title: myDoc.title,
				  categories:myDoc.tagNames,
				  partialType: myDoc.partialType,
				  headlineImage: myDoc.headlineImage,
				  filterDate: myDoc.filterDate,
				  postSource: myDoc.postSource,
				  target: myDoc.target
				},
			  $setOnInsert: {
				  author:myDoc.author,
				  date:myDoc.displayDate
			  }
			},
			{ upsert: true},
			 function(err, result){
				if(err){
					//req.logger.Write('error', "Note database error" + err)
				}

				callback(result);
			}
		);
	}
	
	MongoClient.connect(url, function(err, db){
		updateDocument(db, function(){
			//req.logger.Write('info', "Database Closed");
			db.close();	
		});
	});
}

/* Insert any of the blog tags into the tag database
*/

function updateTagDB(blogTags, req, res){
	//req.logger.Write('data', "1: (updateTagDB) function entry");
	
	var updateTags = function(db, callback){

		db.collection(dbTagColl).update(
			{_id:1},
			{ $addToSet: {
				tagObject: { $each: blogTags }
				}
			},
			{ upsert: true},
			 function(err, result){
				if(err){
					//req.logger.Write('error', "Tag database error" + err)
				}

				callback(result);
			}
		);
	}
		
	MongoClient.connect(url, function(err, db){
		updateTags(db, function(){
			//req.logger.Write('db', "Tag Database Closed");
			db.close();	
			res.end();
		});
	});
}

function deletePost(guid, req){
	//req.logger.Write('data', "1: deletePost function entry");

	var removeBlogEntry = function(db, callback) {
	   db.collection(dbArticleColl).deleteOne(
		  { _id: guid },
		  function(err, results) {
			 console.log(results);
			 callback();
		  }
	   );
	};

	MongoClient.connect(url, function(err, db) {

	  assert.equal(null, err);

	  removeBlogEntry(db, function() {
		  db.close();
	  });
	});

}



module.exports = router;