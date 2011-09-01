define('notifier/ext/fella/fella', [], function () {

  var fellajs = {
  
  };


  var events = function () {
    var that = {};
    var slice = [].slice;
    var subscriptions = {};


    that.publish = function (topic) {
      console.log("PUBLISH:   " + topic);
      var args = slice.call(arguments, 1),
        subscription,
        len,
        i=0,
        ret;

      if(!subscriptions[ topic ]) {
        return true;
      }
      len = subscriptions[topic].length;
      console.log("found subscriptions: "+len);
      for(;i<len;i++) {
        subscription = subscriptions[topic][i];
        console.log("handle subscription");
        ret = subscription.callback.apply( subscription.context, args );

        // callback should always return true,
        // interceptor pattern here >>
        if (ret === false) {
          break;
        }
      }
      return ret !== false;
    };

    that.subscribe = function (topic, context, callback, priority) {
      console.log("subscribe:"+topic);
      if ( arguments.length === 3 && typeof callback === "number" ) {
        priority = callback;
        callback = context;
        context = null;
      }
      if (arguments.length === 2) {
        callback = context;
        context = null;
      }
      priority = priority || 10;

      var topicIndex = 0,
        topics = topic.split( /\s/ ),
        topicLength = topics.length,
        added;

      console.log("to topics");
      console.log(topics);
      for( ; topicIndex < topicLength; topicIndex++) {
        topic = topics[ topicIndex ];
        added = false;
        if( !subscriptions[topic]) {
          subscriptions[topic] = [];
          console.log("add topic:"+topic);
        }
        console.log("subs len:"+subscriptions[topic].length);
        var i = subscriptions[topic].length - 1,
          subcriptionInfo = {
            callback: callback,
            context: context,
            priority: priority
          };

        console.log("topic:"+topic);
        console.log("at:"+i);
        for( ;i>=0; i--) {
          if(subscriptions[topic][i].priority <= priority) {
            subscriptions[topic].splice(i+1,0,subcriptionInfo);
            added = true;
            break;
          }
        }

        if(!added) {
          subscriptions[topic].unshift(subcriptionInfo);
        }
      }
      return callback;
    };

    that.unsubscribe = function (topic, callback) {
      if(!subscriptions[topic]) {
        return;
      }

      var len = subscriptions[topic].length,
        i = 0;

      for(;i<len;i++) {
        if(subscriptions[topic][i].callback === callback) {
          subscriptions[topic].splice(i,1);
          break;
        }
      }
    };

    return that;
  }

  var async = function () {
    var that = {};
    that.first = {};
    that.last = {};

    that.asyncMap = function (list, fn, cb_) {
      var n = list.length,
        results = [],
        errState = null
      function cb (er, data) {
        if (errState) {
          return
        }
        if (er) {
          return cb(errState = er)
        }
        results.push(data)
        if (-- n === 0) {
          return cb_(null, results)
        }
      }
    
      if (list.length === 0) {
        return cb_(null, []);
      }
      list.forEach(function (l) {
        fn(l, cb)
      });
    };

    that.bindActor = function () {
      var args = Array.prototype.slice.call(arguments),
        obj = null,
        fn;

      if (typeof args[0] === "object") {
        obj = args.shift();
        fn = args.shift();
        if(typeof fn === "string") {
          fn = obj[fn];
        }
      } else {
          fn = args.shift();
      }
      return function (cb) {
        fn.apply(obj, args.concat(cb));
      };
    };

    that.chain = function (things, res, cb) {
      if(!cb) {
        cb = res;
        res = [];
      }
      (function LOOP (i, len) {
        if(i >= len) {
          return cb(null, res);
        }
        if(things[i].constructor.toString().indexOf("Array") !== -1) {
          things[i] = that.bindActor.apply(null, things[i].map(function(i) {
            return (i === that.first) ? res[0] : (i === that.last) ? res[res.length-1]: i
          }));
        }
        
        if(!things[i]) {
          return LOOP(i + 1, len);
        }
        
        things[i](function (er, data) {
          res.push( er || data);
          if(er) {
            return cb( er, res);
          }
          LOOP(i+1, len);
        });
      })(0, things.length);
    };
    return that;
  };

  
  fellajs.events = events();
  fellajs.async = async();

  return fellajs;
  
});
