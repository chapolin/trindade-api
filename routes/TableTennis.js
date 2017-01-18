(function() {
  "use strict";
  
  var TableTennisController = require("../controller/TableTennis").TableTennisController,
    controller = new TableTennisController();
  
  module.exports = function (app) {
    // Crud wins insert: start
    app.post('/wins', function(request, response) {
      // controller.saveOrRemove(request, response);
    });
    // Crud wins insert: end
    
    // Crud wins insert: start
    app.post('/player', function(request, response) {
      controller.save(request, response);
    });
    // Crud wins insert: end
    
    // Crud player list all: start
    app.get('/players', function(request, response) {
      controller.getAll(request, response);
    });
    // Crud player all: end
  };
})();
