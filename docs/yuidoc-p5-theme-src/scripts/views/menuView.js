define([
  'underscore',
  'backbone',
  'App',
  'text!tpl/menu.html'
], function(_, Backbone, App, menuTpl) {

  var menuView = Backbone.View.extend({
    el: '#collection-list-nav',
    /**
     * Init.
     * @returns {object} This view.
     */
    init: function() {
      this.menuTpl = _.template(menuTpl);
      return this;
    },
    /**
     * Render.
     * @returns {object} This view.
     */
    render: function() {
    
      var groups = [];
      _.each(App.modules, function (item, i) {
        if (!item.is_submodule) {
          if (!item.file || item.file.indexOf('addons') === -1) { //addons don't get displayed on main page
            groups.push(item.name);
          }
        }
        //}
      });

      // Sort groups by name A-Z
      groups.sort();

      var menuHtml = this.menuTpl({
        'groups': groups
      });

      // Render the view
      this.$el.html(menuHtml);
    },

    hide: function() {
      this.$el.hide();
    },

    show: function() {
      this.$el.show();
    },

    /**
     * Update the menu.
     * @param {string} el The name of the current route.
     */
    update: function(menuItem) {
      //console.log(menuItem);
      // this.$menuItems.removeClass('active');
      // this.$menuItems.find('a[href=#'+menuItem+']').parent().addClass('active');

    }
  });

  return menuView;

});