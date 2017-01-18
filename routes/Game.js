(function() {
  "use strict";
  
  var Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(), 
    GameRepository = require("../repository/Game").GameRepository, 
    repository = new GameRepository(),
    TableTennisController = require("../controller/TableTennis").TableTennisController,
    controller = new TableTennisController(), Util = require("../libs/Util").Util,
    Game = require("../models/Game").Game;
  
    module.exports = function (app) {
      // Crud game insert: start
      app.post('/game', function(request, response) {
        if(Util.attrExists(request.body, "winner") && 
          Util.attrExists(request.body, "loser")) {
            
          var winner = request.body.winner, 
              loser = request.body.loser,
              game = new Game(winner, loser);
          
          repository.insert(game, function(data) {
            response.json(data);
          });
        } else {
          response.json({error: "Invalid data!"});
        }
      });
      // Crud game insert: end
    };
})();