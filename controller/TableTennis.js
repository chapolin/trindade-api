(function() {
  "use strict";
  // Put in some constants file
  const KEY_ALL_PLAYERS = "*";
  
  var TableTennisRepository = require("../repository/TableTennis").TableTennisRepository, 
      Util = require("../libs/Util").Util,
      Player = require("../models/Player").Player;
  
  var TableTennisController = exports.TableTennisController = function() {
    this.repository = new TableTennisRepository();
  };
  
  TableTennisController.prototype.save = function(request, response) {
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
  
  TableTennisController.prototype.getAll = function(request, response) {
    this.repository.getAll(KEY_ALL_PLAYERS, function(players) {
      response.json(players);
    });
  };
})();
