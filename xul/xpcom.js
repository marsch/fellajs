define('notifier/ext/fella/xul/xpcom', [
  'notifier/ext/fella/xul/http',
  'notifier/ext/fella/xul/process'
], function (httpFactory, processFactory) {
  
  var xpcom = {
    http: httpFactory(),
    process: processFactory()
  };

  return xpcom;

});
