(function() {
  "use strict";
  
  // Put in some constants file
  const KEY_ALL_GAMES = "*", SORT_BY_WINS = 1, SORT_BY_AVERAGE = 2,
    KEY_ALL_SORTED_GAMES_BY_DATE_DESC = "*_sorted_date_desc";
  
  let CartolaRepository = require("../repository/Cartola").CartolaRepository, 
      Util = require("../libs/Util").Util,
      Cartola = require("../models/Cartola").Cartola;
      
  let CartolaController = exports.CartolaController = function() {
    this.repository = new CartolaRepository();
  };
  
  CartolaController.prototype.save = function(request, response) {
    let cartola = Util.prepareObject(request.body, Cartola);

    if(!Util.emptyObject(cartola)) {
      cartola.data = new Date();

      this.repository.insert(cartola, (data) => {
        this.repository.eraseAll("*");

        response.json(data[0]);
      });
    } else {
      response.json({error: "Invalid data!"});
    }
  };

  CartolaController.prototype.getAll = function(request, response) {
    this.repository.getAllWithSort("*", {"data": -1, }, (data) => {
      response.json(data[0]);
    });
  };
})();
