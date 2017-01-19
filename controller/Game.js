(function() {
  "use strict";
  
  // Put in some constants file
  const KEY_ALL_GAMES = "*", KEY_ALL_GROUPED_GAMES = "*_grouped",
  KEY_ALL_SORTED_GAMES_BY_DATE_DESC = "*_sorted_date_desc";
  
  let GameRepository = require("../repository/Game").GameRepository, 
      Util = require("../libs/Util").Util,
      Game = require("../models/Game").Game,
      GameReport = require("../models/GameReport").GameReport;
      
  let GameController = exports.GameController = function() {
    this.repository = new GameRepository();
  };
  
  GameController.prototype.save = function(request, response) {
    let game = Util.prepareObject(request.body, Game);
    
    if(!Util.emptyObject(game) && Util.attrExists(game, "winner") && 
      Util.attrExists(game, "loser")) {
        
      game.date = Util.now(true);
      
      this.repository.insert(game, (data) => {
        this.repository.eraseAll(KEY_ALL_GAMES);
        this.repository.eraseAll(KEY_ALL_SORTED_GAMES_BY_DATE_DESC);
        
        response.json(data);
      });
    } else {
      response.json({error: "Invalid data!"});
    }
  };
  
  GameController.prototype.getLastGames = function(request, response) {
    this.repository.getAllWithSort(KEY_ALL_SORTED_GAMES_BY_DATE_DESC, {date: -1}, (games) => {
      response.json({
        "total": games.length,
        "games": games
      });
    });
  };
  
  GameController.prototype.getAll = function(request, response) {
    this.repository.getAll(KEY_ALL_GAMES, (games) => {
      response.json({
        "total": games.length,
        "games": games
      });
    });
  };
  
  GameController.prototype.getGroupedData = function(request, response) {
    this.repository.getAll(KEY_ALL_GROUPED_GAMES, (games) => {
      let gameReportList = {};
      
      for(let index in games) {
        if(!gameReportList[games[index].winnerId]) {
          gameReportList[games[index].winnerId] = new GameReport(
            games[index].winnerId, games[index].winner);
        }
        
        if(!gameReportList[games[index].loserId]) {
          gameReportList[games[index].loserId] = new GameReport(
            games[index].loserId, games[index].loser);
        }
        
        gameReportList[games[index].winnerId].wins++;
        gameReportList[games[index].winnerId].games++;
        gameReportList[games[index].loserId].defeats++;
        gameReportList[games[index].loserId].games++;
      }
      
      response.json(gameReportList);
    });
  };
})();
