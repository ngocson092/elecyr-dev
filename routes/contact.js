fs = require('fs');
_ = require('underscore');

exports.post = function (req, res) {
  var info = req.body
  var email = info.email.replace("@", "_")
  var fname = 'contact_messages/' + email + '_' + (new Date()).getTime();
  var msg = "";

  _.each(info, function(val, key) {
    msg += (key + ": " + val + '\n');
  });

  fs.writeFile(fname, msg, "utf8", function() {
    res.json({
      OK: info.first_name
    });
  });
};