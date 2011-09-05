define('notifier/ext/fella/http', [
  'notifier/ext/fella/xul/xpcom'
], function (xpcomFactory) {

  var xpcom = xpcomFactory;


  var http = function () {
    var that = {};

    that.request = function (options, callback) {
      return xpcom.http.request(options, callback);
    };

    return that;
  };

  return http;

});
