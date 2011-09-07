define('notifier/ext/fella/xul/files', [], function() {
  var files = function() {
    var that = {};

    var CC = Components.classes,
        CI = Components.interfaces;
   

    var initFile = function (path) {
      var file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
      file.initWithPath(path);
      return file;
    };

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

    that.create = function (path, type, permission) {
      var nsType = "";
      if (type === "directory") {
        nsType = CI.nsIFile.DIRECTORY_TYPE;
      } else{
        nsType = CI.nsIFile.NORMAL_FILE_TYPE;
      } 
      console.log("creating:"+path);
      var file = initFile(path);
      if (!file.exists() || !file.isDirectory() ) {
        file.create (nsType, permission);
      }
      //TODO: throw error if exists
    };

    that.exists = function (path) {
      var file = initFile(path);
      return file.exists();
    },

    that.isDirectory = function (path) {
      var file = initFile(path);
      return (file.exists()) ? file.isDirectory(): false;
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


    /*
    * TODO: make it more configurable, this implementation is very limited
    */
    that.writeFile = function (path, contents, callback) {
      var file,
        foStream,
        converter;

      file = initFile(path);
      
      console.log("writing into" + path);
      console.log(contents);

      foStream = CC['@mozilla.org/network/file-output-stream;1'].createInstance(CI.nsIFileOutputStream);
      //flags for opening files
      //0x01 Open for reading only
      //0x02 Open for writing only
      //0x04 Open for reading and writing
      //0x08 If the file does not exist, the file is created, if the file exists, this has no effect
      //0x10 File pointer is set to the end of the file
      //0x20 if the file exists, the length is truncated to 0
      //0x40 if set, each write will wait for both the file data and file status to be phyically updated
      //0x80 if the file does not exist, than created, if it exists than no action at all

      foStream.init(file, 0x02 | 0x08 | 0x20, 0777, 0);

      converter = CC['@mozilla.org/intl/converter-output-stream;1'].createInstance(CI.nsIConverterOutputStream);
      converter.init(foStream, 'UTF-8', 0, 0);
      converter.writeString(contents);
      converter.close(); //close the file
      callback(null, true);
    };

    that.getUserHome = function () {
      var dirService = CC['@mozilla.org/file/directory_service;1'].getService(CI.nsIProperties);
      var homeDirFile = dirService.get("Home", CI.nsIFile);
      return homeDirFile.path;
    };

    return that;
  };
  return files;
});
