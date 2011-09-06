define('notifier/ext/fella/files', [
  'notifier/ext/fella/xul/xpcom'
], function (xpcomFactory) {

  var xpcom = xpcomFactory;

  var files = function () {
    var that = {};

    that.getInfo = function (path, callback) {
      xpcom.files.getInfo(path, callback);
    };

    that.readFile = function (path, callback) {
      xpcom.files.readFile(path, callback);
    };

    that.getUserHome = function () {
      return xpcom.files.getUserHome();
    }

    return that;
  };

  return files;
});
