(function() {
  "use strict";
  
  let PlayerController = require("../controller/Player").PlayerController,
    controller = new PlayerController();
  
  module.exports = function (app) {
    // Crud wins insert: start
    app.post('/player', (request, response) => {
      controller.save(request, response);
    });
    // Crud wins insert: end
    
    // Crud wins update: start
    app.put('/player', (request, response) => {
      controller.change(request, response);
    });
    // Crud wins update: end
    
    // Crud player list all: start
    app.get('/players', (request, response) => {
      controller.getAll(request, response);
    });
    // Crud player all: end
  };
})();
