(function() {
  "use strict";
  
  let Repository = require("./Repository").Repository, 
    Util = require("../libs/Util").Util,
    Redis = require("../libs/RedisCache").RedisCache, redis = new Redis();
  
  let CartolaRepository = exports.CartolaRepository = function() {
    this.key = "cartola";
    this.collecion = "cartola";
    this.ttl = 604800;
  };

  CartolaRepository.prototype.getWithQuery = function(query, callback) {
    let collection = global.mongo.collection(this.getCollection());

    collection.findOne(query, (error, data) => {
      if(error) {
        console.error("Error getting data from mongodb.");
        
        data = {error: error, origin: "mongodb"};
      }
      
      callback(data);
    });  
  };
  
  Util.extend(CartolaRepository, Repository);
})();
