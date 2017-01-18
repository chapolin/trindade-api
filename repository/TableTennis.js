(function() {
  "use strict";
  
  var Repository = require(
    "./Repository").Repository, Util = require("../libs/Util").Util,
  Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(),
  _ = require("lodash");
  
  var TableTennisRepository = exports.TableTennisRepository = function() {
    this.key = "player";
    this.collecion = "player";
    this.ttl = 604800;
  };
  
  TableTennisRepository.prototype.insert = function(player, callback) {
    var collection = global.mongo.collection(this.getCollection()), self = this;
    
    collection.insert(player, {w:1}, function(error, data) {
        if(!error) {
          console.log("%s inserted!", self.getCollection());
        
          var key = self.getKey() + self.getSeparator() + player.identifier;
          
          // Saving in redis
          redis.put(key, player);
        }
        
        callback(data);
    });
  };
  
  TableTennisRepository.prototype.checkIfExists = function(identifier, callback) {
    var key = this.getKey() + this.getSeparator() + identifier, self = this;
    
    redis.get(key, function(data) {
      if(data.hasOwnProperty("_id")) {
        callback(true);
      } else {
        var collection = global.mongo.collection(self.getCollection());

        collection.find({ identifier: identifier}).toArray(function(error, data) {
          if(_.get(data)) {
            if(data.length > 1) {
              for(var i = 1; i < data.length; i++) {
                if(data[i]) {
                  collection.remove({_id: global.mongodb.ObjectID(data[i]._id)});
                }
              }
            }
            
            redis.put(key, data[0]);
            
            callback(true);
          } else {
            callback(false);    
          }
        });  
      }
    });
  };
  
  Util.extend(TableTennisRepository, Repository);
})();
