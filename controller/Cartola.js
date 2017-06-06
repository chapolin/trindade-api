(function() {
  "use strict";
  
  let CartolaRepository = require("../repository/Cartola").CartolaRepository, 
      Util = require("../libs/Util").Util,
      Redis = require("../libs/RedisCache").RedisCache,
      redis = new Redis(),
      Cartola = require("../models/Cartola").Cartola;


      
  let CartolaController = exports.CartolaController = function() {
    this.repository = new CartolaRepository();
  };

  CartolaController.prototype.save = function(request, response) {
    let cartola = Util.prepareObject(request.body, Cartola);

    if(!Util.emptyObject(cartola)) {
      cartola.data = new Date();

      this.repository.getWithQuery({ key: request.body.key }, (data) => {
        if(!data) {
          this.repository.insert(cartola, (data) => {
            response.json({"ok": true});
          });
        } else {
          this.repository.update(data._id, cartola, (data) => {
            response.json({"ok": true});
          });
        }
      });
    }
  }

  CartolaController.prototype.get = function(request, response) {
    if(!request.query.key) {
      response.json(null);
    } else {
     let key = this.repository.getKey() + this.repository.getSeparator() + request.query.key;

      redis.get(key, (data) => {
        if(!Util.emptyObject(data)) {
          response.json(data);
        } else {
          this.repository.getWithQuery({ key: request.query.key }, (data) => {
            if(data) {
              redis.put(key, data);
            }

            response.json(data);
          });
        }
      }); 
    }
  };
})();
