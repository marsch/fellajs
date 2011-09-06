define('notifier/ext/fella/process', [
  'notifier/ext/fella/xul/xpcom'
], function (xpcomFactory) {
  var xpcom = xpcomFactory;

  var process = function() {
    var that = {};
    
    /*
    * TODO: should return a generic process Object within the callback
    * so the process is stopable later
    */
    that.execute = function (executable, args, callback) {
      return xpcom.process.execute(executable, args, callback);
    };
    return that;
  };

  return process;
});
