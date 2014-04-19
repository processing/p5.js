/**
 * Define global App.
 */
var App = window.App || {};
define('App', function() {
  return App;
});

/**
 * Load json API data and start the router.
 * @param {module} _
 * @param {module} Backbone
 * @param {module} App
 * @param {module} router
 */
require([
  'underscore',
  'backbone',
  'App'], function(_, Backbone, App) {
  
  // Set collections
  App.collections = ['classes', 'events', 'methods', 'properties'];

  // Get json API data
  $.getJSON("data.json", function(data) {
    App.data = data;
    App.classes = [];
    App.methods = [];
    App.properties = [];
    App.events = [];
    App.allItems = [];
    App.project = data.project;

    var items = data.classitems;
    var classes = data.classes;

    // Get class items (methods, properties, events)
    _.each(items, function(el, idx, array) {
      if (el.itemtype) {
        if (el.itemtype === "method") {
          App.methods.push(el);
          App.allItems.push(el);
        } else if (el.itemtype === "property") {
          App.properties.push(el);
          App.allItems.push(el);
        } else if (el.itemtype === "event") {
          App.events.push(el);
          App.allItems.push(el);
        }
      }
    });

    //console.log(App.data);

    // Get classes
    _.each(classes, function(el, idx, array) {
      App.classes.push(el);
      App.allItems.push(el);
    });
    
    require(['router']);
  });
});