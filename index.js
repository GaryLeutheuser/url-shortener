var express = require('express');
var app = express();

var open = require('open');

// Hold all URL/number code tuples in an array. Not ideal, but it could easily be
// adapted to a hash table for scaling if that was ever needed (which it won't
// be).
var urlCodes = [];

app.get('/', function(req, res) {
   res.sendfile('hello.html', {root: __dirname + '/public' } ); 
});

app.get('/new/:url', function(req, res) {
    // Check if a code has already been generated for that particular URL.
    var urlIndex = -1;
    for (var i = 0; i < urlCodes.length; i++) {
        urlIndex = urlCodes[i].indexOf(req.params.url);
        if (urlIndex !== -1)
            break;
    }
    
    if (urlIndex === -1) {
        var code = Math.round(Math.random() * 1000);
        urlCodes.push([req.params.url, code]);
    }
    
    res.end(urlCodes.toString());
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