define('notifier/ext/fella/fella', [
  'notifier/ext/fella/events',
  'notifier/ext/fella/async',
  'notifier/ext/fella/http',
  'notifier/ext/fella/process'

], function (events, async, http, process) {

  var fellajs = {

  };

  fellajs.events = events();
  fellajs.async = async();
  fellajs.http = http();
  fellajs.process = process();

  console.log("process:"+fellajs.process);

  return fellajs;
});
