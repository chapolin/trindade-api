(function() {
  "use strict";
  // Put in some constants file
  const KEY_ALL_GAMES = "*", KEY_ALL_SORTED_GAMES_BY_DATE_DESC = "*_sorted_date_desc";
  
  var GameRepository = require("../repository/Game").GameRepository, 
      Util = require("../libs/Util").Util,
      Game = require("../models/Player").Game;
  
  var GameController = exports.GameController = function() {
    this.repository = new GameRepository();
  };
  
  GameController.prototype.getLastGames = function(request, response) {
    this.repository.getAllWithSort(KEY_ALL_SORTED_GAMES_BY_DATE_DESC, {date: -1}, function(games) {
      response.json({"games": games});
    });
  };
  
  GameController.prototype.getAll = function(request, response) {
    this.repository.getAll(KEY_ALL_GAMES, function(games) {
      response.json({"games": games});
    });
  };
})();
