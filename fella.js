define('fella/fella', [], function () {

  var fellajs = {
  
  };




  var subscriptions = [],
    slice = [].slice;


  var events = {
    
    publish: function (topic) {
      var args = slice.call(arguments, 1), 
        len,
        i=0,
        ret;

      if(!subscriptions[ topic ]) {
        return true;
      }

      len = subscriptions[topic].length;
      for(;i<len;i++) {
        subscription = subscriptions[topic][i];
        
        ret = subscription.callback.apply( subscription.context, args );

        // callback should always return true,
        // interceptor pattern here >>
        if (ret === false) {
          break;
        }
      }
      return ret !== false;
    },

    subscribe: function (topic, context, callback, priority) {
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
      for( ; topicIndex < topicLength; topicIndex++) {
        topic = topics[ topicIndex ];
        added = false;
        if( !subscriptions[topic]) {
          subscriptions [ topic ] = [];
        }

        var i = subscriptions[ topic ].length - 1,
          subcriptionInfo = {
            callback: callback,
            context: context,
            priority: priority
          };

        for( ;i>=0; i--) {
          if(subscriptions[topic][i].priority <= priority) {
            subscriptions[topic].splice(i+1,0,subcriptionInfo);
            added = true;
            break;
          }
        }
      }
      return callback;
    },

    unsubscribe: function (topic, callback) {
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
    }
  };






  fellajs.events = events;

  return fellajs;
  
});
