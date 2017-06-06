(function() {
  "use strict";
  
  let Repository = require("./Repository").Repository, 
    Util = require("../libs/Util").Util;
  
  let CartolaAdminRepository = exports.CartolaAdminRepository = function() {
    this.key = "cartolaAdmin";
    this.collecion = "cartola-admin";
    this.ttl = 604800;
  };
  
  Util.extend(CartolaAdminRepository, Repository);
})();
