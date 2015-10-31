var periodical = require('kindle-periodical');
var request = require('request');
var Entities = require('html-entities').AllHtmlEntities;

request('https://www.reddit.com/r/nosleep/.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    generate(JSON.parse(body));
  }
})

function generate(body){
	var itemCount = body.data.children.length;
	var children = body.data.children;
	var articles = [];
	var entities = new Entities();

	for(var i=2;i<itemCount;i++){
		var text = children[i].data.selftext.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/(?:\r\n|\r|\n)/g, '<br />');

		var article = {
			"title" : children[i].data.title,
			"author" : children[i].data.author,
			"content" : '<body>'+text+'</body>'
		};

		articles.push(article);
	}

	var bookData = {
		"title"         : 'No Sleep1',
	    "creator"       : 'Reddit community',
	    "publisher"     : 'reddit.com',
	    "subject"       : 'No Sleep ebook generated from reddit',
	    "description"   : '-',
	    "date"          : new Date(), // (optional) Javascript date object. If unset, will be new Date()
	    "sections"      : [{
	        "title" : 'No Sleep',
	        "articles"  : articles
	    }]	
	};

	console.log(JSON.stringify(bookData));

	periodical.create(bookData, {
    	target : '.' // path must exist and be writable
	});	
}