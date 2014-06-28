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
  App.collections = ['allItems', 'classes', 'events', 'methods', 'properties', 'sound'];

  // Get json API data
  $.getJSON("data.json", function(data) {
    App.data = data;
    App.classes = [];
    App.methods = [];
    App.properties = [];
    App.events = [];
    App.allItems = [];
    App.sound = { items: [] };
    App.modules = [];
    App.project = data.project;


    var modules = data.modules;

    // Get class items (methods, properties, events)
    _.each(modules, function(m, idx, array) {
      App.modules.push(m);
      if (m.name == "p5.sound") {
        App.sound.module = m;
      }
    });


    var items = data.classitems;
    var classes = data.classes;

    // Get classes
    _.each(classes, function(el, idx, array) {
      App.classes.push(el);
    });

    // Get class items (methods, properties, events)
    _.each(items, function(el, idx, array) {

      var pieces = el.class.split(':');
      if (pieces.length > 1) {
        el.module = pieces[0];
        el.class = pieces[1];
      }
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

        // libraries
        if (el.module === "p5.sound") {
          App.sound.items.push(el);
        }
      }
    });

    _.each(App.classes, function(c, idx) {
      c.items = _.filter(App.allItems, function(it){ return it.class === c.name; });
    });

    require(['router']);
  });
});