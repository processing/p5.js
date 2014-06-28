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
        if (item.file.indexOf('addons') === -1) { //addons don't get displayed on main page
          groups.push(item.name);
        }
      });

      // Sort groups by name A-Z
      _.sortBy(self.groups, this.sortByName);

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


          // <dl>
          //     <dt>A&#8211;E</dt>
          //     <dd><a href="#group-color">Color</a></dd>
          //     <dd><a href="#group-constants">Constants</a></dd>
          //     <dd><a href="#group-data">Data</a></dd>
          //     <dd><a href="#group-environment">Environment</a></dd>
          // </dl>    

          // <dl>
          //     <dt>I&#8211;O</dt>
          //     <dd><a href="#group-image">Image</a></dd>
          //     <dd><a href="#group-input">Input</a></dd>
          //     <dd><a href="#group-math">Math</a></dd>
          //     <dd><a href="#group-output">Output</a></dd>
          // </dl>

          // <dl>
          //     <dt>S&#8211;T</dt>
          //     <dd><a href="#group-shape">Shape</a></dd>
          //     <dd><a href="#group-structure">Structure</a></dd>
          //     <dd><a href="#group-transform">Transform</a></dd>
          //     <dd><a href="#group-typography">Typography</a></dd>
          // </dl>

          // <dl>
          //     <dt>U&#8211;Z</dt>
          //     <dd><a href="#group-shape">Uber Test</a></dd>
          //     <dd><a href="#group-shape">Viability test</a></dd>
          //     <dd><a href="#group-shape">W/4 columns</a></dd>
          //     <dd><a href="#group-shape">Zoinks!</a></dd>
          // </dl>

    }

  });

  return menuView;

});