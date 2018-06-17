define(
  [
    'App',
    // Templates
    'text!tpl/library.html'
  ],
  function(App, libraryTpl) {
    var libraryView = Backbone.View.extend({
      el: '#list',
      events: {},
      /**
       * Init.
       */
      init: function() {
        this.libraryTpl = _.template(libraryTpl);

        return this;
      },
      /**
       * Render the list.
       */
      render: function(m, listCollection) {
        if (m && listCollection) {
          var self = this;

          // Render items and group them by module
          // module === group
          this.groups = {};
          _.each(m.items, function(item, i) {
            var module = item.module || '_';
            var group;
            // Override default group with a selected category
            // TODO: Overwriting with the first category might not be the best choice
            // We might also want to have links for categories
            if (item.category && item.category[0]) {
              group = item.category[0];
              // Populate item.hash
              App.router.getHash(item);

              // Create a group list without link hash
              if (!self.groups[group]) {
                self.groups[group] = {
                  name: group.replace('_', '&nbsp;'),
                  module: module,
                  hash: undefined,
                  items: []
                };
              }
            } else {
              group = item.class || '_';
              var hash = App.router.getHash(item);

              var ind = hash.lastIndexOf('/');
              hash = hash.substring(0, ind);

              // Create a group list
              if (!self.groups[group]) {
                self.groups[group] = {
                  name: group.replace('_', '&nbsp;'),
                  module: module,
                  hash: hash,
                  items: []
                };
              }
            }

            self.groups[group].items.push(item);
          });

          // Sort groups by name A-Z
          self.groups = _.sortBy(self.groups, this.sortByName);

          // Put the <li> items html into the list <ul>
          var libraryHtml = self.libraryTpl({
            title: self.capitalizeFirst(listCollection),
            module: m.module,
            totalItems: m.items.length,
            groups: self.groups
          });

          // Render the view
          this.$el.html(libraryHtml);
        }

        return this;
      },
      /**
       * Show a list of items.
       * @param {array} items Array of item objects.
       * @returns {object} This view.
       */
      show: function(listGroup) {
        if (App[listGroup]) {
          this.render(App[listGroup], listGroup);
        }
        App.pageView.hideContentViews();

        this.$el.show();

        return this;
      },
      /**
       * Helper method to capitalize the first letter of a string
       * @param {string} str
       * @returns {string} Returns the string.
       */
      capitalizeFirst: function(str) {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
      },
      /**
       * Sort function (for the Array.prototype.sort() native method): from A to Z.
       * @param {string} a
       * @param {string} b
       * @returns {Array} Returns an array with elements sorted from A to Z.
       */
      sortAZ: function(a, b) {
        return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;
      },

      sortByName: function(a, b) {
        if (a.name === 'p5') return -1;
        else return 0;
      }
    });

    return libraryView;
  }
);
