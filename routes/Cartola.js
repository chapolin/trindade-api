(function() {
  "use strict";
  
  let CartolaController = require("../controller/Cartola").CartolaController,
    controller = new CartolaController();
  
  module.exports = function (app) {
    // Crud data insert: start
    app.post('/cartola/save', (request, response) => {
      controller.save(request, response);
    });
    // Crud data insert: end
    
    // Crud data: start
    app.get('/cartola/data', (request, response) => {
      controller.getAll(request, response);
    });
    // Crud data: end
  };
})();
