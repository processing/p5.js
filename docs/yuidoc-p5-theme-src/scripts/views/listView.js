define([
  'underscore',
  'backbone',
  'App',
  // Templates
  'text!tpl/list.html'
], function(_, Backbone, App, listTpl) {

  var listView = Backbone.View.extend({
    el: '#list',
    events: {
      //'click #sort-az': 'sortAZ'
    },
    /**
     * Init.
     */
    init: function() {
      this.listTpl = _.template(listTpl);

      return this;
    },
    /**
     * Render the list.
     */
    render: function(items, listCollection) {
      if (items && listCollection) {
        var self = this;

        // Render items and group them by module
        // module === group
        this.groups = {};
        _.each(items, function(item, i) {
          var item = items[i];
          var group = item.module || '_';
          var subgroup = item.class || '_';
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

          self.groups[group].subgroups[subgroup].items.push(item);
        });

        // Sort groups by name A-Z
        _.sortBy(self.groups, this.sortByName);

        // Sort items by name A-Z
        _.each(self.groups, function(group) {
          _.sortBy(group.subgroups, this.sortByName);
          _.each(group.subgroups, function(subgroup) {
            _.sortBy(subgroup.items, this.sortByName);
          });
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
    show: function(listGroup) {
      if (App[listGroup])
        this.render(App[listGroup], listGroup);

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
    
    sortByName: function(a,b) {
      return a.name > b.name ? 1 : -1;
    }

  });

  return listView;

});