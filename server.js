var express = require('express');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname + '/public')));
console.log(path.join(__dirname + '/public'));

var open = require('open');

// Hold all URL/number code tuples in an array. Not ideal, but it could easily be
// adapted to a hash table for scaling if that was ever needed (which it won't
// be for my purposes).
var urlCodes = [];

app.get('/', function(req, res) {
   res.sendFile('default.html', {root: path.join(__dirname + '/public')});
});

app.get('/new/:url', function(req, res) {
    var shortenedData = {
        originalURL: req.params.url,
        shortenedURL: null
    };
    
    // Check if a code has already been generated for that particular URL.
    var urlIndex = -1;
    for (var i = 0; i < urlCodes.length; i++) {
        urlIndex = urlCodes[i].indexOf(req.params.url);
        if (urlIndex !== -1) {
            shortenedData.shortenedURL = 'https://gleutheuser-url-shortener.herokuapp.com/' + urlCodes[i][1];
            break;
        }
    }
    
    if (urlIndex === -1) {
        var code = Math.round(Math.random() * 1000);
        urlCodes.push([req.params.url, code]);
        shortenedData.shortenedURL = 'https://gleutheuser-url-shortener.herokuapp.com/' + code;
    }
    
    res.end(JSON.stringify(shortenedData));
});

app.get('/:code', function(req, res) {
    var code = parseInt(req.params.code);

    var codeIndex = -1;
    for (var i = 0; i < urlCodes.length; i++) {
        codeIndex = urlCodes[i].indexOf(code);
        if (codeIndex !== -1) {
            res.redirect('http://' + urlCodes[i][0]);
        }
    }
    
    res.end('Invalid code.');
});

app.listen(process.env.PORT || 5000);