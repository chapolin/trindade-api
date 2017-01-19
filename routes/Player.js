(function() {
  "use strict";
  
  var PlayerController = require("../controller/Player").PlayerController,
    controller = new PlayerController();
  
  module.exports = function (app) {
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
