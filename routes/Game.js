(function() {
  "use strict";
  
  let GameController = require("../controller/Game").GameController,
    controller = new GameController();

  module.exports = function (app) {
    // Crud game insert: start
    app.post('/game', (request, response) => {
      controller.save(request, response);
    });
    // Crud game insert: end
    
    app.get('/games', (request, response) => {
      controller.getAll(request, response);
    });
    
    app.get('/games/last', (request, response) => {
      controller.getLastGames(request, response);
    });
  };
})();
