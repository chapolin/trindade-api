(function() {
  "use strict";
  
  let _ = require("lodash");

  let Util = exports.Util = function () {};

  /**
  *  Extends one "class" with other "class" properties and methods.
  */
  Util.extend = function (receivingClass, givingClass) {
    if (arguments[2]) {
        for (let i=0, len=arguments.length; i<len; i++) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    } else {
        for (let methodName in givingClass.prototype) {
            if (!receivingClass.prototype[methodName]) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
        }
    }
  };
  
  /**
  * Verify if field request is valid
  */
  Util.attrExists = function(object, attrName) {
  	if(_.get(object, attrName)) {
  		return true;
  	}
  	
  	return false;
  };
  
  Util.now = function(mustHaveFormat) {
    let date = new Date();
    
    if(mustHaveFormat) {
      return Util.formatFullDate(date);  
    }
  
    return date;
  };

  Util.formatFullDate = function(date) {
  	let day = Util.adjustingTimeValue(date.getDate()),
      	month = Util.adjustingTimeValue(date.getMonth(), true),
        hours = Util.adjustingTimeValue(date.getHours()),
        minutes = Util.adjustingTimeValue(date.getMinutes()),
        seconds = Util.adjustingTimeValue(date.getSeconds()),
      	year = date.getFullYear();

  	return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + 
      seconds;
  };
  
  Util.adjustingTimeValue = function(number, plusOne) {
    if(plusOne === true) {
      number++;
    }
    
    return (number <= 9 ? "0" : "") + number;
  };
  
  Util.isTrue = function(value) {
    let TRUTHY_VALUES = [true, 'true', 1, '1'];

    return TRUTHY_VALUES.some(function(t) {
        return t === value;
    });
  };
  
  // Clear and Prepare any literal javascript object considering request.body data
  Util.prepareObject = function(data, clazz) {
    let object = new clazz();
    
    for(let attribute in object) {
      if(Util.attrExists(data, attribute)) {
        object[attribute] = data[attribute];
      } else {
        delete object[attribute];
      }
    }
    
    return object;
  };
  
  // Check if any object isEmpty
  Util.emptyObject = function(object) {
    let empty = true; 
    
    if(typeof object !== "undefined") {
      for(let index in object) {
        empty = false;
        
        break;
      }
    }
    
    return empty;
  };
  
  Util.prepareForResponse = function(object, typeSort) {
    let arr = [];
    
    for(let index in object) {
      arr.push(object[index]);
    }
    
    if(typeSort == 1) {
      arr.sort(Util.sortGameReportByWins);
    }
    
    return arr;
  };
  
  // Sort gameReport by wins
  Util.sortGameReportByWins = function(a, b) {
    var x = a.wins;
    var y = b.wins;

    return x < y ? 1 : x > y ? -1 : 0;
  };
})();
