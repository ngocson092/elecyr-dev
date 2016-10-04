// GET home page.

exports.index = function(req, res){
  res.render('index', {menu_ctx: ''});
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};

exports.main = function (req, res) {
    var name = req.params.name;
    res.render(name, {menu_ctx: '/'});
};

exports.articles = function (req, res) {
    var name = req.params.name;
    res.render('articles/' + name, {menu_ctx: '/'});
};