module.exports = (function() {
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
            message: err,
          });
        } else {
          res.send({
            code: 200,
            message: 'Run successfully created.',
            runId: runId
          });    
        }
      });
    }

    function finishRun(req, res) {

    }

    function addItem(req, res) {

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