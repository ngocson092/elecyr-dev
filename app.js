// Depends on:
// ExpressJS ( http://expressjs.org )
// WebSocket ( https://github.com/Worlize/WebSocket-Node )
// Commander ( https://github.com/visionmedia/commander.js )
// Bootstrap ( https://github.com/Srirangan/express-bootstrap )
// Stripe    ( https://github.com/abh/node-stripe )

var express = require('express'),
    http = require( 'http' ),
    routes = require('./routes'),
    user = require('./routes/user'),
    api = require('./routes/api'),
    contact = require('./routes/contact'),
    path = require( 'path' ),
    fs = require( 'fs' ),
    expressValidator = require('express-validator'),
    options = require( 'commander' ),    jade = require('jade'),
    WebSocketServer = require('websocket').server,
    WebSocketRouter = require('websocket').router,
    favicon = require('serve-favicon');
// Handle options with Commander

options.version( '0.0.1' )
. usage( '[options]' )
. option( '-v, --verbose', 'verbose logging' )
. option( '-p, --listen-port <port>', 'port to listen on [default: 8080]', Number, 80 )
. option( '-i, --listen-interface <interface>',
         help='interface to listen on. [default: 0.0.0.0]',
         String,
         '0.0.0.0' )
. parse( process.argv );

var app = module.exports = express();


// Configuration


app.set( 'port', options.listenPort );
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set( 'view options', { layout: false });
if( options.verbose ) app.use( express.logger( 'dev' ) );
app.use( expressValidator );
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/icons/favicon.ico'));
// Routes

app.get('/', routes.index);

app.get('/partials/:name', routes.partials);
app.get('/articles/:name', routes.articles);

app.get('/:name', routes.main);

app.get('/robots', function(req,res){
  res.set('Content-Type', 'text/plain');
  res.send('User-agent: *\nAllow: /');
});

// JSON API

app.get('/oauth', api.oauth);
app.get('/oauth_callback', api.oauth_callback);
app.get('/api/posts', api.posts);
app.get('/api/post/:id', api.getPost);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);

app.get('/api/tags', api.getTags);

// Contact Handler

app.post('/contact', contact.post)

/* Render view routes */

/*nimble*/


// Init wrapper
var Nimble =  require('node-nimble-api');

var nimble = new Nimble({
    appId: 'zly8ani0ch9ehijujudxwoc3ieukklja6iv31',
    appSecret: 'kd3ysr4ho8wrqnckyg'
});


app.get('/nimble/authorization', function(req, res) {
    res.redirect(nimble.getAuthorizationUrl({redirect_uri: 'https://elecyr.dev/nimble/callback'}));
});


// You must make sure that the wrapper is using for requesting the access token the SAME
// redirect_uri provided for getAuthorizationUrl, either by using the same wrapper or by
// providing the redirect_uri in the wrapper constructor if you are using a new object for requestToken.

app.get('/nimble/callback', function(req, res) {
    if(!req.query.error) {
        /*
            nimble.requestToken(req.query.code, function(err, access_token, refresh_token, result) {
                res.send('You are now authenticated! -> ' + access_token);
            });
        */
        res.render('nimble/test',{code:req.query.code});

    } else {
        res.send('Error authenticating!!! -> ' + err);
    }
});



app.get('/nimble/contacts', function(req, res) {

    nimble.requestToken(req.query.code, function(err, access_token, refresh_token, result) {
        nimble.findContacts({}, function(err, result, response) {
            if(err) return res.send('ERROR' + JSON.stringify(err));
            res.write('These are your contacts \n');
            result.resources.forEach(function(r) {
                res.write(JSON.stringify(r));
            })
            return res.end();
        });
    });


});

/*nimble*/



// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

var https = require('https');
var fs = require('fs');

var options = {

    /*
    * openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
    * */

    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

var httpServer = http.createServer( app );
httpServer.listen( app.get( 'port' ), options.listenInterface, function(){
  console.log( 'Express server listening on port ' + app.get( 'port' ) );
} );


https.createServer(options, app).listen(443);

// Bind WebSocket processor to http server

var wsServer = new WebSocketServer( {
   httpServer: httpServer
} );

// Create the request router and bind it to WebSocket

var wsRouter = new WebSocketRouter();
wsRouter.attachServer( wsServer );

// Set up WebSocket handlers
//
// Common function for all sockets
// 'this' is the object exported from the sockets/[...].js

function socketHandler( request ) {
    
    var connection = request.accept( request.origin );

    var that = this;

    connection.on( 'message', function( message ) {
      // Accept only text messages
      if( message.type !== 'utf8' )
      return;
      
      try {
      var data = JSON.parse( message.utf8Data );
      // Pass the data to the corresponding socket handler
      // and send the result to the socket
      connection.send( JSON.stringify( that.calc( data ) ) );
      } catch( x ) {
      console.log( 'Error: ' + x );
      connection.send( JSON.stringify( { error: x } ) );
      }
      } );
}

fs.readdir( __dirname + '/sockets', function( err, files ) {
   if( err )
   return;
   var jsFile = /^([^.]+)\.js$/i;
   files.forEach( function( file ) {
     var match = jsFile.exec( file );
     if( ! match )
     return;
     wsRouter.mount( '/' + match[ 1 ], '', socketHandler.bind( require( './sockets/' + match[ 1 ] ) ) ); 
     console.log( 'Service "' + match[ 1 ] + '" mounted' );
     } );
   } );

process.on('uncaughtException', function (err) {
   console.error(err);
   console.log("Node NOT Exiting...");
   });

