(function() {
  "use strict";
  
  let conn = null, redis = require('redis');

  let RedisCache = exports.RedisCache = function (properties) {
    if(!conn) {
      conn = redis.createClient(process.env.REDIS_URL);
      
      conn.on("ready", () => {
  			console.log("Redis is ready!");
  		});
  		
  		conn.on("end", () => {
  			console.error("Could not connect to Redis: Connection refused");
  		});
    }
  };

  RedisCache.prototype.put = function(key, value, ttl) {
    if(!ttl) {
      conn.set(key, JSON.stringify(value));
    } else {
      conn.setex(key, ttl, JSON.stringify(value));
    }
  };

  RedisCache.prototype.get = function(key, callback) {
    conn.get(key, (error, data) => {
      if(data) {
        callback(JSON.parse(data));
      } else {
        callback({});
      }
    });
  };

  RedisCache.prototype.remove = function(key) {
    conn.del(key);
  };

  RedisCache.prototype.getAll = function(key, callback) {
    conn.keys(key, callback);
  };

  RedisCache.prototype.on = function (message, callback) {
    conn.on(message, callback);
  };

  RedisCache.prototype.publish = function (channel, message) {
    conn.publish(channel, message);
  };
})();
