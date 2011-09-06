define('notifier/ext/fella/fella', [
  'notifier/ext/fella/events',
  'notifier/ext/fella/async',
  'notifier/ext/fella/http',
  'notifier/ext/fella/process',
  'notifier/ext/fella/storage',
  'notifier/ext/fella/files'

], function (events, async, http, process, storage, files) {

  var fellajs = {

  };

  fellajs.events = events();
  fellajs.async = async();
  fellajs.http = http();
  fellajs.process = process();
  fellajs.storage = storage();
  fellajs.files = files();


  return fellajs;
});
