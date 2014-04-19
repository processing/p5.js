define([
  'underscore',
  'backbone',
  'App',
  
  // Views
  'searchView',
  'listView',
  'itemView',
  'fileView',
  'menuView'
], function(_, Backbone, App, searchView, listView, itemView, fileView, menuView) {

  var pageView = Backbone.View.extend({
    el: 'body',
    /**
     * Init.
     */
    init: function() {
      App.$container = $('#container');
      App.contentViews = [];

      return this;
    },
    /**
     * Render.
     */
    render: function() {
      
      // Menu view
      if (!App.menuView) {
        App.menuView = new menuView();
        App.menuView.init().render();
      }
      
      // Item view
      if (!App.itemView) {
        App.itemView = new itemView();
        App.itemView.init().render();
        // Add the item view to the views array
        App.contentViews.push(App.itemView);
      }
      
      // File view
      if (!App.fileView) {
        App.fileView = new fileView();
        App.fileView.init().render();
        // Add the item view to the views array
        App.contentViews.push(App.fileView);
      }
      
      // List view
      if (!App.listView) {
        App.listView = new listView();
        App.listView.init().render();
        // Add the list view to the views array
        App.contentViews.push(App.listView);
      }
      
      // Search
      if (!App.searchView) {
        App.searchView = new searchView();
        App.searchView.init().render();
      }
      
      return this;
    },
    /**
     * Hide item and list views.
     * @returns {object} This view.
     */
    hideContentViews: function() {
      _.each(App.contentViews, function(view, i) {
        view.$el.hide();
      });
      
      return this;
    }
  });

  return pageView;

});