define([
  'underscore',
  'backbone',
  'App'
], function(_, Backbone, App) {

  'use strict'; //

  var Router = Backbone.Router.extend({
    
    routes: {
      '': 'list',
      'p5': 'list',
      'p5/': 'list',
      'classes': 'list',
      'search': 'search',
      'libraries/:lib': 'library',
      ':searchClass(/:searchItem)': 'get'
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

      // if looking for a library page, redirect
      if ((searchClass === 'p5.dom' || searchClass === 'p5.sound')
          && !searchItem) {
        window.location.hash = '/libraries/'+searchClass;
        return;
      } 

      var self = this;
      this.init(function() {
        var item = self.getItem(searchClass, searchItem);

        App.menuView.hide();

        if (item) {
          App.itemView.show(item);
        } else {
          //App.itemView.nothingFound();

          self.list();
        }

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
          if ((className == 'p5' || items[i].class.toLowerCase() === className) && 
            items[i].name.toLowerCase() === itemName) {
            found = items[i];
            break;
          }
        }
      }

      return found;
    },
    /**
     * List items.
     * @param {string} collection The name of the collection to list.
     */
    list: function(collection) {

      collection = 'allItems';

      // Make sure collection is valid
      if (App.collections.indexOf(collection) < 0) {
        return;
      }

      this.init(function() {
        App.menuView.show(collection);
        App.menuView.update(collection);
        App.listView.show(collection);
      });
    },
    /**
     * Display information for a library.
     * @param {string} collection The name of the collection to list.
     */
    library: function(collection) {
      this.init(function() {
        App.menuView.hide();
        App.libraryView.show(collection.substring(3)); //remove p5.
      });
    },
    /**
     * Close all content views.
     */
    search: function() {
      this.init(function() {
        App.menuView.hide();
        App.pageView.hideContentViews();
      });
    },
    /**
     * Create an hash/url for the item.
     * @param {Object} item A class, method, property or event object.
     * @returns {String} The hash string, including the '#'.
     */
    getHash: function(item) {
      if (!item.hash) {
        var hash = '#/';
        var isClass = item.hasOwnProperty('classitems');
        var c = (item.file.indexOf('objects') === -1 && item.file.indexOf('addons') === -1 ) ? 'p5' : item.class;
        // Create hash for links
        if (isClass) {
          hash += item.name;
        } else {
          hash += c + '/' + item.name;
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
