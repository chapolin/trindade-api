(function() {
  "use strict";

  let GameReport = exports.GameReport = function(identifier = "", name = "", games = 0, wins = 0, defeats = 0) {
    this.identifier = identifier;
    this.name = name;
    this.games = games;
    this.wins = wins;
    this.defeats = defeats;
  };
})();
