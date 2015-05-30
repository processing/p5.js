define([
  'underscore',
  'backbone',
  'App',
  // Templates
  'text!tpl/list.html'
], function (_, Backbone, App, listTpl) {

  var listView = Backbone.View.extend({
    el: '#list',
    events: {},
    /**
     * Init.
     */
    init: function () {
      this.listTpl = _.template(listTpl);

      return this;
    },
    /**
     * Render the list.
     */
    render: function (items, listCollection) {
      if (items && listCollection) {
        var self = this;

        // Render items and group them by module
        // module === group
        this.groups = {};
        _.each(items, function (item, i) {
          if (item.file.indexOf('addons') === -1) { //addons don't get displayed on main page

            var group = item.module || '_';
            var subgroup = item.submodule || '_';
            if (group === subgroup) {
              subgroup = '0';
            }
            var hash = App.router.getHash(item);

            // Create a group list
            if (!self.groups[group]) {
              self.groups[group] = {
                name: group.replace('_', '&nbsp;'),
                subgroups: {}
              };
            }

            // Create a subgroup list
            if (!self.groups[group].subgroups[subgroup]) {
              self.groups[group].subgroups[subgroup] = {
                name: subgroup.replace('_', '&nbsp;'),
                items: []
              };
            }

            if (item.file.indexOf('p5.') === -1) {

              self.groups[group].subgroups[subgroup].items.push(item);

            } else {

              var found = _.find(self.groups[group].subgroups[subgroup].items,
                function(i){ return i.name == item.class; });

              if (!found) {

                // FIX TO INVISIBLE OBJECTS: DH (see also router.js)
                var ind = hash.lastIndexOf('/');
                hash = item.hash.substring(0, ind).replace('p5/','p5.');
                self.groups[group].subgroups[subgroup].items.push({
                  name: item.class,
                  hash: hash
                });
              }

            }
          }
        });

        // Put the <li> items html into the list <ul>
        var listHtml = self.listTpl({
          'title': self.capitalizeFirst(listCollection),
          'groups': self.groups,
          'listCollection': listCollection
        });

        // Render the view
        this.$el.html(listHtml);
      }

      return this;
    },
    /**
     * Show a list of items.
     * @param {array} items Array of item objects.
     * @returns {object} This view.
     */
    show: function (listGroup) {
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
    capitalizeFirst: function (str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
    }



  });

  return listView;

});
