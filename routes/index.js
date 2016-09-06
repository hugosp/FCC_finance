'use strict';

var yahooFinance    = require('yahoo-finance');
var fs              = require("fs");
var request         = require('request');

module.exports = function(app, passport) {
    
    app.get('/', function(req, res) {
        res.render('index');
    });
    
    app.get('/api/get/:id/:start/:end', function(req,res) {
        yahooFinance.historical({
            symbol: req.params.id,
            from: req.params.start,
            to: req.params.end,
            period: 'd'                     // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
        }, function (err, quotes) {
            if(err) throw err;
            res.json(quotes);
        }); 
    });

    app.get('/api/autocomplete/:search',function(req,res) {
        var url = "http://d.yimg.com/autoc.finance.yahoo.com/autoc?region=US&lang=en&query="+req.params.search;
        request(url,function(err,rest,body){
            res.json(JSON.parse(body).ResultSet.Result);
        });
    });

    app.get('/api/getdb',function(req,res) {
        var array = fs.readFileSync('db').toString().split('\n');
        res.json(array);  
    });

    app.get('/api/deletedb/:name',function(req,res) {
        var array = fs.readFileSync('db').toString().split('\n');
        var index = array.indexOf(req.params.name.toUpperCase());
        if(index != -1) {
            console.log(req.params.name.toUpperCase(),' : ',index);
            array.splice(index,1);
            fs.writeFile('db',array.join('\n'),function(err) {
                res.json(array);
            });
        } else {
            res.json({error:true,message:'not in db'});
        }
    });

    app.get('/api/putdb/:name',function(req,res) {
        var array = fs.readFileSync('db').toString().split('\n');
        if(array.indexOf(req.params.name.toUpperCase()) == -1) {
            fs.appendFile('db', '\n'+req.params.name, function (err) {
                res.json({error:false,name:req.params.name});
            });
        } else {
            res.json({error:true,name:req.params.name,message:'stock already exists'});
        }
    });
}