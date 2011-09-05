define('notifier/ext/fella/process', [
  'notifier/ext/fella/xul/xpcom'
], function (xpcomFactory) {
  var xpcom = xpcomFactory;

  var process = function() {
    var that = {};

    that.execute = function (executable, args, callback) {
      return xpcom.process.execute(executable, args, callback);
    };
    return that;
  };

  return process;
});
