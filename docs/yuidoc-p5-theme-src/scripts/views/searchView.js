define([
  'underscore',
  'backbone',
  'App',
  // Templates
  'text!tpl/search.html',
  'text!tpl/search_suggestion.html',
  // Tools
  'typeahead'
], function(_, Backbone, App, searchTpl, suggestionTpl) {

  var searchView = Backbone.View.extend({
    el: '#search',
    /**
     * Init.
     */
    init: function() {
      var tpl = _.template(searchTpl);
      var className = 'form-control input-lg';
      var placeholder = 'Search the API';
      this.searchHtml = tpl({
        'placeholder': placeholder,
        'className': className
      });
      this.items = App.classes.concat(App.allItems);

      return this;
    },
    /**
     * Render input field with Typehead activated.
     */
    render: function() {
      // Append the view to the dom
      this.$el.append(this.searchHtml);
      
      // Render Typeahead
      var $searchInput = this.$el.find('input[type=text]');
      this.typeaheadRender($searchInput);
      this.typeaheadEvents($searchInput);

      return this;
    },
    /**
     * Apply Twitter Typeahead to the search input field.
     * @param {jquery} $input
     */
    typeaheadRender: function($input) {
      var self = this;
      $input.typeahead(null, {
        'displayKey': 'name',
        'minLength': 2,
        //'highlight': true,
        'source': self.substringMatcher(this.items),
        'templates': {
          'empty': '<p class="empty-message">Unable to find any item that match the current query</p>',
          'suggestion': _.template(suggestionTpl)
        }
      });
    },
    /**
     * Setup typeahead custom events (item selected).
     */
    typeaheadEvents: function($input) {
      var self = this;
      $input.on('typeahead:selected', function(e, item, datasetName) {
        var selectedItem = self.items[item.idx];
        select(selectedItem);
      });
      $input.on('keydown', function(e) {
        if (e.which === 13) { // enter
          var txt = $input.val();
          var f = _.find(self.items, function(it) { return it.name == txt; });
          if (f) {
            select(f); 
          }
        } else if (e.which === 27) {
          $input.blur();
        }
      });

      function select(selectedItem) {
        var hash = App.router.getHash(selectedItem).replace('#', '');
        App.router.navigate(hash, {'trigger': true});
        $input.blur();
      }
    },
    /**
     * substringMatcher function for Typehead (search for strings in an array).
     * @param {array} array
     * @returns {Function}
     */
    substringMatcher: function(array) {
      return function findMatches(query, callback) {
        var matches = [], substrRegex, arrayLength = array.length;

        // regex used to determine if a string contains the substring `query`
        substrRegex = new RegExp(query, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `query`, add it to the `matches` array
        for (var i=0; i < arrayLength; i++) {
          var item = array[i];
          if (substrRegex.test(item.name)) {
            // typeahead expects suggestions to be a js object
            matches.push({
              'itemtype': item.itemtype,
              'name': item.name,
              'className': item.class,
              'is_constructor': item.is_constructor,
              'final': item.final,
              'idx': i
            });
          }
        }

        callback(matches);
      };
    }

  });

  return searchView;

});
