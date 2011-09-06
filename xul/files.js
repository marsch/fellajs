define('notifier/ext/fella/xul/files', [], function() {
  var files = function() {
    var that = {};

    var CC = Components.classes,
        CI = Components.interfaces;
    

    that.getInfo = function (path, callback) {
      var file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
      file.initWithPath(path);

      var fileInfo = {
        size: file.fileSize,
        lastModified: file.lastModifiedTime,
        name: file.leafName,
        nativePath: file.nativePath,
        path: file.path
      
      };
      callback(null, fileInfo);
    };

    that.readFile = function (path, callback) {
      var data = "",
        file,
        fstream,
        cstream;

      file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
      file.initWithPath(path);
      
      fstream = CC['@mozilla.org/network/file-input-stream;1'].createInstance(CI.nsIFileInputStream);
      cstream = CC['@mozilla.org/intl/converter-input-stream;1'].createInstance(CI.nsIConverterInputStream);

      fstream.init(file, -1, 0, 0);
      cstream.init(fstream, "UTF-8", 0, 0);
      console.log("reading file");
      var str = {};
      while(cstream.readString(0xffffffff, str) != 0) {
        data += str.value;
      }
      cstream.close();
      callback(null, data);
    };
    return that;
  };
  return files;
});
