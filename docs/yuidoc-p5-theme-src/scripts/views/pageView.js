define([
  'App',

  // Views
  'searchView',
  'listView',
  'itemView',
  'menuView',
  'libraryView'
], function(App, searchView, listView, itemView, menuView, libraryView) {

  // Store the original title parts so we can substitue different endings.
  var _originalDocumentTitle = window.document.title;

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

      // List view
      if (!App.listView) {
        App.listView = new listView();
        App.listView.init().render();
        // Add the list view to the views array
        App.contentViews.push(App.listView);
      }

      // Library view
      if (!App.libraryView) {
        App.libraryView = new libraryView();
        App.libraryView.init().render();
        // Add the list view to the views array
        App.contentViews.push(App.libraryView);
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
    },
    /**
     * Append the supplied name to the first part of original document title.
     * If no name is supplied, the title will reset to the original one.
     */
    appendToDocumentTitle: function(name){
      if(name){
        let firstTitlePart = _originalDocumentTitle.split(" | ")[0];
        window.document.title = [firstTitlePart, name].join(" | ");
      } else {
        window.document.title = _originalDocumentTitle;
      }
    }    
  });

  return pageView;

});
