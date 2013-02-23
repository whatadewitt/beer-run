module.exports = (function() {
    var async = require('async');
    var request = require('request');
    var runStore = new require('../../runstore');
    var cheerio = require('cheerio');

    function getPricelist(req, res) {
      runStore.getPricelist({
        vendor: "garrison"
      }, function(err, pricelist) {
        if (err) {
          fetchPricelist(req, res);
        } else {
          res.end(pricelist, 200);
        }
      });
    }

    function fetchPricelist(req, res) {
      var pricelist = {};
      pricelist.products = [];
      request('http://www.mynslc.com/Pages/advancedSearch.aspx?k=garrison', 
        function(err, resp, body) {
          $ = cheerio.load(body);
          $('div#products-list ul li').each(function(i, ul){
            var product = {};
            product.title = $('.details h5 a', this).html();
            product.image = 'http://www.mynslc.com'+$('.image img', this).attr('src');
            product.price = $('.desc h6', this).html();
            product.unitSize  = $('.details p', this).eq(2).html();
            pricelist.products.push(product);
          });
          res.end(pricelist);
          runStore.storePricelist({
            vendor: "garrison"
          }, function(success) {
            if (!success) {
              //I tried to store it.
              runStore.storePricelist({
                vendor: "garrison"
              });
            }
          });
        }
      );
    }

    function createRun(req, res) {
      var runId;

      runStore.createRun({
        fb_id: req.user.id,
        overwrite: req.body.force // should be set in request.body
      }, function(err, runId) {
        if (err) {
          res.send({
            code: 400,
            message: err
          }, 400);
        } else {
          res.send({
            code: 200,
            message: 'Run successfully created.',
            data: {
              //facebook data
            },
            runId: runId
          }, 200);
        }
      });
    }

    function finishRun(req, res) {
      runStore.finishRun({
        fb_id: req.user.id,
        r_id: req.params.id
      }, function(err, success) {
        if(err && !success) {
          res.send({
            code: 400,
            message: err
          }, 400);
        } else {
          res.send({
            code: 200,
            message: 'Beer has been got!'
          }, 200);
        }
      })
    }

    function addItem(req, res) {
      async.eachSeries(req.body.items, function(item, callback) {
        runStore.addItem({
          r_id: req.params.id,
          fb_id: req.user.id
        }, 
        item, 
        function(params) {
          callback();
        });
      }, function() {
        res.send({
          code: 200,
          message: 'Item(s) have been added!'
        }, 200);
      });
    } 

    function gotItem(req, res) {
      runStore.gotItem({
        fb_id: req.user.id,
        r_id: req.params.id,
        item_id: req.body.item_id,
        status: req.body.status
      }, function() {
        res.send({
          code: 200,
          message: 'Item(s) have been added!'
        }, 200);
      });
    }

    return {
        priceList: getPricelist,
        createRun: createRun,
        finishRun: finishRun,
        addItem: addItem,
        gotItem: gotItem
    }
})();