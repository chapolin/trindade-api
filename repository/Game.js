(function() {
  "use strict";
  
  let Repository = require("./Repository").Repository, 
    Util = require("../libs/Util").Util,
    Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(),
    _ = require("lodash");
  
  let GameRepository = exports.GameRepository = function() {
    this.key = "game";
    this.collecion = "game";
    this.ttl = 604800;
  };
  
  Util.extend(GameRepository, Repository);
})();
