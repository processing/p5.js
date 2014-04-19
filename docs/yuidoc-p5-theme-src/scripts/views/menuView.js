define([
  'underscore',
  'backbone',
  'App'
], function(_, Backbone, App) {

  var menuView = Backbone.View.extend({
    el: '#menu',
    /**
     * Init.
     * @returns {object} This view.
     */
    init: function() {
      this.$menuItems = this.$el.find('li');

      return this;
    },
    /**
     * Render.
     * @returns {object} This view.
     */
    render: function() {
      

      return this;
    },
    /**
     * Update the menu.
     * @param {string} el The name of the current route.
     */
    update: function(menuItem) {
      //console.log(menuItem);
      this.$menuItems.removeClass('active');
      this.$menuItems.find('a[href=#'+menuItem+']').parent().addClass('active');
    }

  });

  return menuView;

});