'use strict';

var yahooFinance = require('yahoo-finance');

module.exports = function(app, passport) {
    
    app.get('/', function(req, res) {
        res.render('index');
    });
    
    app.get('/api/get/:id/:start/:end', function(req,res) {
        yahooFinance.historical({
            symbol: req.params.id,
            from: req.params.start,
            to: req.params.end,
            period: 'w'                     // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
        }, function (err, quotes) {
            if(err) throw err;
            res.json(quotes);
        }); 
    });
}