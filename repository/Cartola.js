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
  
  Util.extend(CartolaRepository, Repository);
})();
