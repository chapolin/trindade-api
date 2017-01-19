(function() {
  "use strict";
  
  var Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(), 
    GameRepository = require("../repository/Game").GameRepository, 
    repository = new GameRepository(),
    PlayerController = require("../controller/Player").PlayerController,
    controller = new PlayerController(), Util = require("../libs/Util").Util,
    Game = require("../models/Game").Game;
    
    var GameController = require("../controller/Game").GameController,
      controller = new GameController();
  
    module.exports = function (app) {
      // Crud game insert: start
      app.post('/game', function(request, response) {
        if(Util.attrExists(request.body, "winner") && 
          Util.attrExists(request.body, "loser")) {
            
          var winnerId = request.body.winnerId,
              winner = request.body.winner, 
              loserId = request.body.loserId,
              loser = request.body.loser,
              date = new Date(),
              game = new Game(winnerId, winner, loserId, loser, date);
          
          repository.insert(game, function(data) {
            response.json(data);
          });
        } else {
          response.json({error: "Invalid data!"});
        }
      });
      // Crud game insert: end
      
      app.get('/games', function(request, response) {
        controller.getAll(request, response);
      });
      
      app.get('/games/last', function(request, response) {
        controller.getLastGames(request, response);
      });
    };
})();
