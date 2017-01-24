(function() {
  "use strict";
  
  // Put in some constants file
  const KEY_ALL_GAMES = "*", KEY_ALL_GROUPED_GAMES = "*_grouped", 
    KEY_ALL_GROUPED_AVERAGE_GAMES = "*_grouped_average",
    KEY_ALL_SORTED_GAMES_BY_DATE_DESC = "*_sorted_date_desc", 
    SORT_BY_WINS = 1, SORT_BY_AVERAGE = 2;
  
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
        this.repository.eraseAll(KEY_ALL_GROUPED_GAMES);
        this.repository.eraseAll(KEY_ALL_GROUPED_AVERAGE_GAMES);
        
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
      let gameReportList = summaryGameData(games);
      
      response.json(Util.prepareForResponse(gameReportList, SORT_BY_WINS));
    });
  };
  
  GameController.prototype.getGroupedAverageData = function(request, response) {
    this.repository.getAll(KEY_ALL_GROUPED_AVERAGE_GAMES, (games) => {
      let gameReportList = summaryGameData(games);
      
      for(let index in gameReportList) {
        let games = gameReportList[index].games,
          wins = gameReportList[index].wins,
          defeats = gameReportList[index].defeats;
          
          let average = (wins * 100) / games;
          
          if(average.toString().indexOf(".") != -1) {
            average = average.toFixed(2);
          }
          
          gameReportList[index].average = Number.parseFloat(average);
      }
      
      response.json(Util.prepareForResponse(gameReportList, SORT_BY_AVERAGE));
    });
  };
  
  let summaryGameData = (games = []) => {
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
      
      gameReportList[ games[index].winnerId ].wins++;
      gameReportList[ games[index].winnerId ].games++;
      gameReportList[ games[index].loserId ].defeats++;
      gameReportList[ games[index].loserId ].games++;
    }
    
    return gameReportList;
  };
})();
