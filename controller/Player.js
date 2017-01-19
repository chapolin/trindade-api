(function() {
  "use strict";
  // Put in some constants file
  const KEY_ALL_PLAYERS = "*", KEY_ALL_SORTED_PLAYERS_BY_NAME_DESC = "*_sorted_name_desc";
  
  var PlayerRepository = require("../repository/Player").PlayerRepository, 
      Util = require("../libs/Util").Util,
      Player = require("../models/Player").Player;
  
  var PlayerController = exports.PlayerController = function() {
    this.repository = new PlayerRepository();
  };
  
  PlayerController.prototype.save = function(request, response) {
    if(Util.attrExists(request.body, "identifier") && 
      Util.attrExists(request.body, "name")) {
        
      var identifier = request.body.identifier, 
          name = request.body.name,
          stars = request.body.stars,
          player = new Player(identifier, name, stars), self = this;

      this.repository.checkIfExists(identifier, function(exists) {
        self.repository.eraseAll(identifier);
        self.repository.eraseAll(KEY_ALL_PLAYERS);
        
        if(!exists) {
          self.repository.insert(player, function(data) {
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
  
  PlayerController.prototype.getAll = function(request, response) {
    this.repository.getAllWithSort(KEY_ALL_SORTED_PLAYERS_BY_NAME_DESC, 
      {name: 1}, function(players) {
      response.json({"players": players});
    });
  };
})();
