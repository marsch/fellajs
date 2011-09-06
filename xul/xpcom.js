define('notifier/ext/fella/xul/xpcom', [
  'notifier/ext/fella/xul/http',
  'notifier/ext/fella/xul/process',
  'notifier/ext/fella/xul/files',
], function (httpFactory, processFactory, filesFactory) {
  
  var xpcom = {
    http: httpFactory(),
    process: processFactory(),
    files: filesFactory()
  };

  return xpcom;

});
