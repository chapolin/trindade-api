(function() {
  "use strict";
  
  // Put in some constants file
  const KEY_ALL_SORTED_PLAYERS_BY_NAME_DESC = "*_sorted_name_desc";
  
  let PlayerRepository = require("../repository/Player").PlayerRepository, 
      Util = require("../libs/Util").Util,
      Player = require("../models/Player").Player;
  
  let PlayerController = exports.PlayerController = function() {
    this.repository = new PlayerRepository();
  };
  
  PlayerController.prototype.save = function(request, response) {
    let player = Util.prepareObject(request.body, Player);
    
    if(!Util.emptyObject(player) && Util.attrExists(player, "identifier")) {
      this.repository.checkIfExists(player.identifier, (exists) => {
        if(!exists) {
          this.repository.insert(player, (data) => {
            this.repository.eraseAll(player.identifier);
            this.repository.eraseAll(KEY_ALL_SORTED_PLAYERS_BY_NAME_DESC);
            
            response.json(data);
          });  
        } else {
          response.json({error: "Player already exists!"});    
        }
      });
    } else {
      response.json({error: "Invalid data!"});
    }
  };
  
  PlayerController.prototype.change = function(request, response) {
    let player = Util.prepareObject(request.body, Player);
    
    if(!Util.emptyObject(player) && Util.attrExists(player, "identifier")) {
      this.repository.checkIfExists(player.identifier, (data) => {
        if(data) {
          this.repository.update(player, (player) => {
            this.repository.eraseAll(player.identifier);
            this.repository.eraseAll(KEY_ALL_SORTED_PLAYERS_BY_NAME_DESC);
            
            response.json(data);
          });
        } else {
          response.json({error: "Player not exists!"});
        }
      });
    } else {
      response.json({error: "Invalid data!"});
    }
  };
  
  PlayerController.prototype.getAll = function(request, response) {
    this.repository.getAllWithSort(KEY_ALL_SORTED_PLAYERS_BY_NAME_DESC, 
      {name: 1}, (players) => {
      response.json({"players": players});
    });
  };
})();
