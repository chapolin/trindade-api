(function() {
  "use strict";
  
  let CartolaAdminRepository = require("../repository/CartolaAdmin").CartolaAdminRepository, 
      Util = require("../libs/Util").Util;
      
  let CartolaAdminController = exports.CartolaAdminController = function() {
    this.repository = new CartolaAdminRepository();
  };

  CartolaAdminController.prototype.createKey = function(request, response) {
    let {id, email} = request.body;

    if(!id && email) {
      this.repository.getAllByFieldAndValue("email", email, (data) => {
        if(!data[0]) {
          this.repository.insert({email: email}, (data) => {
            this.repository.eraseAll(email);
            response.json(data.ops[0]);
          });
        } else {
          response.json(data[0]);
        }
      });
    } else {
      response.json({
        "_id": id,
        "email": email
      });
    }
  };
})();
