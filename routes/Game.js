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
            
          var winnerId = request.body.winnerId,
              winner = request.body.winner, 
              loserId = request.body.loserId,
              loser = request.body.loser,
              game = new Game(winnerId, winner, loserId, loser);
          
          repository.insert(game, function(data) {
            response.json(data);
          });
        } else {
          response.json({error: "Invalid data!"});
        }
      });
      // Crud game insert: end
      
      app.post('/deja', function(request, response) {
        response.json({msg: "Dejavú"});
      });
    };
})();
