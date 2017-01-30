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
    
    app.get('/games/grouped', (request, response) => {
      controller.getGrouped(request, response);
    });
    
    app.get('/games/grouped/average', (request, response) => {
      controller.getGroupedAverage(request, response);
    });
    
    app.get('/games/grouped/average/last/:numberOfGames', (request, response) => {
      controller.getGroupedAverageLastGames(request, response, 
        request.params.numberOfGames);
    });
    
    app.get('/games/migration', (request, response) => {
      controller.migrationDate(request, response);
    });
  };
})();
