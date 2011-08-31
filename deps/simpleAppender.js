Log4js.SimpleAppender = function () {
};


Log4js.SimpleAppender.prototype = Log4js.extend(new Log4js.Appender(), {
  
  
  doAppend: function(loggingEvent) {
    
    //create regexp only once
    if (!Log4js.loggingFilterRegExp) {
      Log4js.loggingFilterRegExp = new RegExp("^" + Log4js.loggingFilter + "$");
    } 
    
    if(Log4js.loggingFilterRegExp.test(loggingEvent.categoryName)) {
      var applicationDate = loggingEvent.startTime - Log4js.applicationStartDate;
      
      if (loggingEvent.message && loggingEvent.message.constructor.toString().indexOf("String") !== -1) {
        console.log(loggingEvent.level.toString() + "  " + loggingEvent.startTime + " (" + applicationDate + "ms)" + " " + loggingEvent.message + " (" +loggingEvent.categoryName + ")");
      } else {
        console.log(loggingEvent.level.toString() + "  " + loggingEvent.startTime + " (" + applicationDate + "ms)" + " (" +loggingEvent.categoryName + ")");
        console.log(loggingEvent.message);
      }
    }
  }
});
