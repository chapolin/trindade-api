(function() {
  "use strict";
  
  let CartolaController = require("../controller/Cartola").CartolaController,
      CartolaAdminController = require("../controller/CartolaAdmin").CartolaAdminController,
    controller = new CartolaController(),
    controllerAdmin = new CartolaAdminController();
  
  module.exports = function (app) {
    // Crud data insert: start
    app.post('/cartola/save', (request, response) => {
      controller.save(request, response);
    });
    // Crud data insert: end
    
    // Crud data: start
    app.get('/cartola/data', (request, response) => {
      controller.get(request, response);
    });
    // Crud data: end

    // Crud Create key: start
    app.post('/cartola/createkey', (request, response) => {
      controllerAdmin.createKey(request, response);
    });
    // Crud Create key: end
  };
})();
