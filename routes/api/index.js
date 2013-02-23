module.exports = (function() {
    var async = require('async');
    var runStore = new require('../../runstore');

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
      async.each(req.body.items)

      runStore.addItem({
        r_id: req.params.id
      })
    }

    function gotItem(req, res) {
      
    }

    return {
        createRun: createRun,
        finishRun: finishRun,
        addItem: addItem,
        gotItem: gotItem
    }
})();