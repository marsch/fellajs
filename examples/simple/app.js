$(document).ready(function() {

  require([
    "../../src/fella"
  ], function () {
    console.log("ready");
    
    var fella = require("fella/fella");
    console.log(fella);
    
    var app = fella.createApp();

    app.start();

  });

});
