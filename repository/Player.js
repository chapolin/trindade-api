(function() {
  "use strict";
  
  let Repository = require(
    "./Repository").Repository, Util = require("../libs/Util").Util,
  Redis = require("../libs/RedisCache").RedisCache, redis = new Redis(),
  _ = require("lodash");
  
  let PlayerRepository = exports.PlayerRepository = function() {
    this.key = "player";
    this.collecion = "player";
    this.ttl = 604800;
  };
  
  // Overriden
  PlayerRepository.prototype.insert = function(player, callback) {
    let collection = global.mongo.collection(this.getCollection());
    
    collection.insert(player, {w:1}, (error, data) => {
        if(!error) {
          console.log(`${this.getCollection()} inserted!`);
        
          let key = this.getKey() + this.getSeparator() + player.identifier;
          
          // Saving in redis
          redis.put(key, player);
        }
        
        callback(data);
    });
  };
  
  // Overriden
  Repository.prototype.update = function(player, callback) {
    let collection = global.mongo.collection(this.getCollection()), 
        keyRedis = this.getKey() + this.getSeparator() + player.identifier;
    
    this.get(player.identifier, (dataToUpdate) => {
      if(dataToUpdate) {
        _.assign(dataToUpdate, player);
        
        collection.update({identifier: player.identifier}, { $set: player }, 
          {w:1}, (error, data) => {
            if(!error) {
              console.log(`${this.getCollection()} updated!`);

              // Saving in redis
              redis.put(keyRedis, dataToUpdate);
            }

            callback(dataToUpdate);
        });
      } else {
        callback({_id: -1, origin: "repository", msg: "not found"});
      }
    });
  };
  
  PlayerRepository.prototype.checkIfExists = function(identifier, callback) {
    let key = this.getKey() + this.getSeparator() + identifier;
    
    redis.get(key, (data) => {
      if(data.hasOwnProperty("_id")) {
        callback(data);
      } else {
        let collection = global.mongo.collection(this.getCollection());

        collection.find({ identifier: identifier}).toArray((error, data) => {
          if(!Util.emptyObject(data)) {
            if(data.length > 1) {
              for(let i = 1; i < data.length; i++) {
                if(data[i]) {
                  collection.remove({_id: global.mongodb.ObjectID(data[i]._id)});
                }
              }
            }
            
            redis.put(key, data[0]);
            
            callback(data[0]);
          } else {
            callback(false);
          }
        });  
      }
    });
  };
  
  Util.extend(PlayerRepository, Repository);
})();
