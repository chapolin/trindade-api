(function() {
  "use strict";
  
  module.exports = function (app) {
    // Live route
    app.get('/live', function(request, response) {
      response.send("LIVE");
    });
  };
})();
