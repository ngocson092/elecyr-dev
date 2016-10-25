/*export:
* mongoexport -h ds033933-a0.mongolab.com:33933 -d dbevernote -c articles -u elecyrAdmin -p zqpM1029 -o G:\articles.json
* mongoexport -h ds033933-a0.mongolab.com:33933 -d dbevernote -c tags -u elecyrAdmin -p zqpM1029 -o G:\tags.json
* */

low = require('lowdb');
const db = low('./data/db.json')
db.defaults({ articles: [], tags: [] }).value();


/*articles*/

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./data/mongolab_articles.json')
});

lineReader.on('line', function (line) {
    db.get('articles')
        .push(JSON.parse(line))
        .value();
});

/*tag*/

 var lineReader1 = require('readline').createInterface({
 input: require('fs').createReadStream('./data/mongolab_tags.json')
 });

 lineReader1.on('line', function (line) {
     var data = JSON.parse(line);
     db.set('tags',data.tagObject).value();
 });


