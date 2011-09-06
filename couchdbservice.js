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

      couchdbURI = path + 'ext/couchdb/couchdb_trunk/var/run/couchdb/couch.uri',
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

    that.start = function (callback) {
      //check timestamp of couch.uri file
      fella.files.getInfo( couchdbURI, function (err, data) {
        var lastModifiedURI = data.lastModified;
        fella.process.execute( erlbinpath, couchdbArgs, function () {
          console.log('COUCHDB START CALLBAKC');
          //now find out if its running.....
          that.waitForStartup( lastModifiedURI, function (err, data) {
            console.log('COUCH IS UP AND RUNNING');
            callback(null,data);
          });
          
        });

        console.log('FILE INFO');
        console.log(data.lastModified);
      });
      //start the process
    };

    that.waitForStartup = function (oldTimeStamp, callback) {
      console.log('waiting... for my couch...');
      fella.files.getInfo( couchdbURI, function (err, data) {
        var newLastModifiedURI = data.lastModified;
        //check the timestamp of couch.uri file
        if (oldTimeStamp < newLastModifiedURI) {
          console.log('old:'+oldTimeStamp);
          console.log('new:'+newLastModifiedURI);
          //if changed, read the contents and trigger the callback with the data
          fella.files.readFile( couchdbURI, function (err, couchURI) {
            that.ping(couchURI, function (err, isUp) {
              if(err) {
                return callback(err, null);
              }
              callback(null, couchURI);
            });
          });
        } else {
          setTimeout(function () {
            that.waitForStartup(oldTimeStamp, callback);
          }, 100);
        }
        
      });
    };

    that.ping = function (uri, callback) {
      $.ajax({
        type: 'GET',
        url: uri,
        error: function (xhr, textStatus, errorThrown) {
          callback(textStatus, null);
        },
        complete: function(req) {
          var resp = $.parseJSON(req.responseText);
          console.log(req.responseText);
          if(resp.couchdb === 'Welcome') { //hehe
            callback(null, true);
          } else {
            callback('not welcome', false);
          }
        }
      });

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
