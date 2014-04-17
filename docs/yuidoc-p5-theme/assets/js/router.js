define([
  'underscore',
  'backbone',
  'App'
], function(_, Backbone, App) {

  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      '': 'list',
      'classes': 'list',
      'methods': 'list',
      'properties': 'list',
      'events': 'list',
      'list:group': 'list',
      'search': 'search',
      'file/:filepath/:line': 'file',
      'get/:searchClass(/:searchItem)': 'get'
    },
    /**
     * Whether the json API data was loaded.
     */
    _initialized: false,
    /**
     * Initialize the app: load json API data and create searchable arrays.
     */
    init: function(callback) {
      var self = this;
      require(['pageView'], function(pageView) {

        // If already initialized, move away from here!
        if (self._initialized) {
          if (callback)
            callback();
          return;
        }

        // Update initialization state: must be done now to avoid recursive mess
        self._initialized = true;

        // Render views
        if (!App.pageView) {
          App.pageView = new pageView();
          App.pageView.init().render();
        }

        // If a callback is set (a route has already been called), run it
        // otherwise, show the default list
        if (callback)
          callback();
        else
          self.list();
      });
    },
    /**
     * Start route. Simply check if initialized.
     */
    start: function() {
      this.init();
    },
    /**
     * Show item details by searching a class or a class item (method, property or event).
     * @param {string} searchClass The class name (mandatory).
     * @param {string} searchItem The class item name: can be a method, property or event name.
     */
    get: function(searchClass, searchItem) {
      var self = this;
      this.init(function() {
        var item = self.getItem(searchClass, searchItem);

        if (item)
          App.itemView.show(item);
        else
          App.itemView.nothingFound();

      });
    },
    /**
     * Returns one item object by searching a class or a class item (method, property or event).
     * @param {string} searchClass The class name (mandatory).
     * @param {string} searchItem The class item name: can be a method, property or event name.
     * @returns {object} The item found or undefined if nothing was found.
     */
    getItem: function(searchClass, searchItem) {
      var classes = App.classes,
              items = App.allItems,
              classesCount = classes.length,
              itemsCount = items.length,
              className = searchClass ? searchClass.toLowerCase() : undefined,
              itemName = searchItem ? searchItem.toLowerCase() : undefined,
              found;

      // Only search for a class, if itemName is undefined
      if (className && !itemName) {
        for (var i = 0; i < classesCount; i++) {
          if (classes[i].name.toLowerCase() === className) {
            found = classes[i];
            break;
          }
        }
        // Search for a class item
      } else if (className && itemName) {
        for (var i = 0; i < itemsCount; i++) {
          if (items[i].class.toLowerCase() === className && items[i].name.toLowerCase() === itemName) {
            found = items[i];
            break;
          }
        }
      }

      return found;
    },
    /**
     * List items.
     * @param {string} collection THe name of the collection to list.
     */
    list: function(collection) {
      // Get collection from the hash if not provided
      // if (!collection)
      //   var collection = location.hash.replace('#', '');
      collection = 'methods'; //temp

      // Make sure collection is valid
      if (App.collections.indexOf(collection) < 0)
        return;

      this.init(function() {
        App.menuView.update(collection);
        App.listView.show(collection);
      });
    },
    /**
     * Close all content views.
     */
    search: function() {
      this.init(function() {
        App.pageView.hideContentViews();
      });
    },
    /**
     * Open the file view.
     * @param {string} filepath
     * @param {string} line
     */
    file: function(filepath, line) {
      this.init(function() {
        App.fileView.show(filepath, line);
      });
    },
    /**
     * Create an hash/url for the item.
     * @param {Object} item A class, method, property or event object.
     * @returns {String} The hash string, including the '#'.
     */
    getHash: function(item) {
      if (!item.hash) {
        var hash = '#get/';
        var isClass = item.hasOwnProperty('classitems');
        // Create hash for links
        if (isClass) {
          hash += item.name;
        } else {
          hash += item.class + '/' + item.name;
        }
        item.hash = hash;
      }
      return item.hash;
    }
  });


  // Get the router
  App.router = new Router();

  // Start history
  Backbone.history.start();

  return App.router;

});
