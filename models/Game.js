(function() {
  "use strict";

  let Game = exports.Game = function(winnerId, winner, loserId, loser, date) {
    this.winnerId = winnerId;
    this.winner = winner;
    this.loserId = loserId;
    this.loser = loser;
    this.date = date;
  };
})();
