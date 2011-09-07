define('notifier/ext/fella/files', [
  'notifier/ext/fella/xul/xpcom'
], function (xpcomFactory) {

  var xpcom = xpcomFactory;

  var files = function () {
    var that = {};

    that.getInfo = function (path, callback) {
      xpcom.files.getInfo(path, callback);
    };
    
    that.exists = function (path) {
      return xpcom.files.exists(path);
    };

    that.isDirectory = function (path) {
      return xpcom.files.isDirectory(path);
    };

    that.createDirectory = function (path, permission) {
      return xpcom.files.create(path, 'directory', permission);
    };

    that.readFile = function (path, callback) {
      xpcom.files.readFile(path, callback);
    };
    that.writeIniFile = function (path, config, callback) {
      console.log("writing configFile");

      var content = "";
      for( category in config ) {
        if(config.hasOwnProperty(category)) {
          content += "[" + category + "]\n";
          for ( entry in config[category] ) {
            if(config[category].hasOwnProperty(entry)) {
              content += entry + " = " + config[category][entry] + "\n";
            }
          }
          content += "\n";
        }
      }
      
      that.writeFile(path, content, callback);
    };
    that.writeFile = function (path, content, callback) {
      xpcom.files.writeFile(path, content, callback);
    };
    that.readIniFile = function (path, callback) {
      console.log("readIniFile");
      var categories = { global: {} };
      if(!that.exists(path)) {
        return callback("File '"+ path + "' doesn't exist", null);
      }

      that.readFile(path, function (err, content) {
        if(err) {
          return callback(err, null);
        }
        
        if(!content || content.length <= 0) {
          return callback(null, categories);
        }

        function newCategory(name) {
          var cat = {};
          categories[name] = cat;
          return cat;
        }
        
        var lines = content.toString().split(/\r?\n/),
            i = 0,
            len = lines.length,
            matchCategory = new RegExp(/^\[(.*)\]$/),
            matchField = new RegExp(/^(.*)?=(.*)$/),
            matchComment = new RegExp(/^\s*(;.*)?$/),
            matchWhitespaces = new RegExp(/^[ \s]+|[ \s]+$/g),
            match,
            currentCategory = newCategory("root");
        
        for( ; i < len; i++) {
          if(matchComment.test(lines[i])) {
            //skip this
          } else if (match = lines[i].match(matchCategory)) {
            currentCategory = newCategory(match[1].replace(matchWhitespaces, ''));
          } else if (match = lines[i].match(matchField)) {  
            currentCategory[match[1].replace(matchWhitespaces, '')] = match[2].replace(matchWhitespaces, '');
          } else {
            throw new Error("Line '" + lines[i] + "' is invalid.");
          }
        }
        console.log("HEHE");
        callback(null, categories);
      });
    };

    that.getUserHome = function () {
      return xpcom.files.getUserHome();
    }

    return that;
  };

  return files;
});
