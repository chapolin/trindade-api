(function() {
  "use strict";
  
  // Put in some constants file
  const KEY_ALL_GAMES = "*", KEY_ALL_SORTED_GAMES_BY_DATE_DESC = "*_sorted_date_desc";
  
  let GameRepository = require("../repository/Game").GameRepository, 
      Util = require("../libs/Util").Util,
      Game = require("../models/Player").Game;
      
  let GameController = exports.GameController = function() {
    this.repository = new GameRepository();
  };
  
  GameController.prototype.save = function(request, response) {
    if(Util.attrExists(request.body, "winner") && 
      Util.attrExists(request.body, "loser")) {
        
      let winnerId = request.body.winnerId,
          winner = request.body.winner, 
          loserId = request.body.loserId,
          loser = request.body.loser,
          date = new Date(),
          game = new Game(winnerId, winner, loserId, loser, date);
      
      repository.insert(game, (data) => {
        response.json(data);
      });
    } else {
      response.json({error: "Invalid data!"});
    }
  };
  
  GameController.prototype.getLastGames = function(request, response) {
    this.repository.getAllWithSort(KEY_ALL_SORTED_GAMES_BY_DATE_DESC, {date: -1}, (games) => {
      response.json({"games": games});
    });
  };
  
  GameController.prototype.getAll = function(request, response) {
    this.repository.getAll(KEY_ALL_GAMES, (games) => {
      response.json({"games": games});
    });
  };
})();
