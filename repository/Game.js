(function() {
  "use strict";
  
  var Repository = require(
    "./Repository").Repository, Util = require("../libs/Util").Util,
  Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(),
  _ = require("lodash");
  
  var GameRepository = exports.GameRepository = function() {
    this.key = "game";
    this.collecion = "games";
    this.ttl = 604800;
  };
  
  Util.extend(GameRepository, Repository);
})();
