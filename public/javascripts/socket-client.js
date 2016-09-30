/*
 * Common WebSocket client for server-side calculators
 *
 * Use (in jade):
 * script(src='javascripts/socket-client.js')
 * script
 *   SocketClient.init( {
 *     service: 'NameOfTheService'
 *   , form: 'NameOfTheForm'
 *   , fields: [ 'Field1', 'Field2', 'Field3' ] // Names of input fields
 *   , callback: function( result ) { // Result is the object received from the server
 *       ...
 *     } 
 *   ) ; 
 *   // If there are several forms on the page, call SocketClient.init several times.
 */

function SocketClient( service, form, fields, callback ) {
  this.service = service;
  this.form = form;
  this.fields = fields;
  this.callback = callback;  
};

SocketClient.prototype.connect = function() {
  this.socket = new WebSocket( 'ws://' + document.location.host + '/' + this.service );
  var that = this;
  this.socket.onopen = function() {
    that.send();
  };
  this.socket.onmessage = function( message ) {
    that.receive( message );
  };
  this.socket.onclose = function() {
    var retryInterval = 500.0;
    window.setTimeout( function () { that.connect(); }, retryInterval );
  }
};

SocketClient.prototype.send = function() {
  var msg = {};
  var that = this;
  this.fields.forEach( function( field ) {
    msg[ field ] = document.forms[ that.form ][ field ].value;
  } );
  this.socket.send( JSON.stringify( msg ) );
};

SocketClient.prototype.receive = function( msg ) {
  var data = JSON.parse( msg.data );
  this.callback( data );
};

SocketClient.init = function( params ) {
  window.addEventListener( 'load', function () {
    var socketClient = new SocketClient( params.service, params.form, params.fields, params.callback );
    socketClient.connect();
    var onChange = function() {
      socketClient.send();
    };
    socketClient.fields.forEach( function( field ) {
      document.forms[ socketClient.form ][ field ].onchange = onChange;
    } );
    document.forms[ socketClient.form ].onsubmit = onChange;
  } );
};
