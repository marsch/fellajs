define('notifier/ext/fella/couchdbservice', ['notifier/common/class'], function (classFactory) {
  var couchdbservice = function (that) {
    that = that || {};
    that = classFactory.extend(that);
    that.classIdentifier = 'org.fellajs.ext.couchdbservice';
    var process,
      file,
      path = '/Users/mario/Documents/_arbeit/OX_PROJECTS/oxnotifier/code/',
      erlbinpath = path + 'ext/couchdb/erlang_R13B04/bin/erl',
      erllibspath = path + 'ext/couchdb/couchdb_trunk/lib/couchdb/erlang/lib',
      defaultini = path + 'ext/couchdb/couchdb_trunk/etc/couchdb/default.ini',
      localini = path + 'ext/couchdb/couchdb_trunk/etc/couchdb/local.ini',
      fella = window.fella;
      
    var couchdbArgs = [
                        '+Bd',
                        '-noinput',
                        '-sasl',
                        '-errlog_type',
                        'error',
                        '+K',
                        'true',
                        '+A',
                        '4',
                        '-env',
                        'ERL_LIBS',
                        erllibspath,
                        '-couch_ini',
                        defaultini,
                        localini,
                        '-s',
                        'couch'
                      ];

    that.init = function (options) {
       
    };

    that.start = function () {
      console.log("fella?"+fella.events);
      console.log(window.fella);
      fella.process.execute( erlbinpath, couchdbArgs, function () {
        console.log("COUCHDB START CALLBAKC");
      
      });
/*
      that.getLogger().trace('start');
      console.log(erlbinpath + " " + couchdbArgs.join(" "));
      process.runwAsync(couchdbArgs, couchdbArgs.length, {
        observe: function(proc, aTopic, aData) {
          console.log('OBSERVE?? - NOTIFICATION');
          console.log(aTopic);

          console.log("isrunning:"+proc.isRunning);
          console.log("exitValue:"+proc.exitValue);

        }
      });*/
    };

    that.stop = function () {
    
    };

    return that;
  };

  var instance = null;
  function factory() {
    return factory.fresh();
  };

  factory.fresh = function () {
    return couchdbservice();
  };

  factory.once = function () {
    if(instance === null) {
      instance = factory.fresh();
    }
    return instance;
  };
  factory.extend = function(obj) {
    var inst = factory.fresh();
    return inst.extend(obj);
  };

  return factory;
});
