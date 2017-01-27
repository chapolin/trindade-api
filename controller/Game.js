(function() {
  "use strict";
  
  // Put in some constants file
  const KEY_ALL_GAMES = "*", SORT_BY_WINS = 1, SORT_BY_AVERAGE = 2,
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
  
  GameController.prototype.getAll = function(request, response) {
    this.repository.getAll(KEY_ALL_GAMES, (games) => {
      response.json({
        "total": games.length,
        "games": games
      });
    });
  };
  
  GameController.prototype.getLastGames = function(request, response) {
    this.repository.getAllWithSort(
      KEY_ALL_SORTED_GAMES_BY_DATE_DESC, {'date': -1, }, (games) => {
      response.json({
        "total": games.length,
        "games": games
      });
    });
  };
  
  GameController.prototype.getGrouped = function(request, response) {
    this.repository.getAll(KEY_ALL_GAMES, (games) => {
      let gameReportList = summaryGames(games);
      
      response.json(Util.prepareForResponse(gameReportList, SORT_BY_WINS));
    });
  };
  
  GameController.prototype.getGroupedAverage = function(request, response) {
    this.repository.getAll(KEY_ALL_GAMES, (games) => {
      let gamesSummarized = summaryGames(games);
      let gameReportList = buildAverageGame(gamesSummarized);
      
      response.json(Util.prepareForResponse(gameReportList, SORT_BY_AVERAGE));
    });
  };
  
  GameController.prototype.getGroupedAverageLastGames = function(request, 
    response, numberOfGames) {
    this.repository.getAllWithSort(KEY_ALL_SORTED_GAMES_BY_DATE_DESC, 
      {date: -1}, (games) => {
        let gamesSummarized = summaryGames(games, numberOfGames);
        let gameReportList = buildAverageGame(gamesSummarized);
      
      response.json(Util.prepareForResponse(gameReportList, SORT_BY_AVERAGE));
    });
  };
  
  let summaryGames = (games = [], numberOfGames = 9999) => {
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
      
      if(gameReportList[ games[index].winnerId ].games < numberOfGames) {
        gameReportList[ games[index].winnerId ].wins++;
        gameReportList[ games[index].winnerId ].games++;  
      }
      
      if(gameReportList[ games[index].loserId ].games < numberOfGames) {
        gameReportList[ games[index].loserId ].defeats++;
        gameReportList[ games[index].loserId ].games++;  
      }
    }
    
    return gameReportList;
  };
  
  let buildAverageGame = (gamesSummarized = []) => {
    for(let index in gamesSummarized) {
      let games = gamesSummarized[index].games,
        wins = gamesSummarized[index].wins,
        defeats = gamesSummarized[index].defeats;
        
        
        // console.log(index, games);
        
        let average = (wins * 100) / games;
        
        if(average.toString().indexOf(".") != -1) {
          average = average.toFixed(2);
        }
        
        gamesSummarized[index].average = Number.parseFloat(average);
    }
    
    return gamesSummarized;
  };
})();
