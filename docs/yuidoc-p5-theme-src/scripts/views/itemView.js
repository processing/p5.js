define([
  'underscore',
  'backbone',
  'App',
  // Templates
  'text!tpl/item.html',
  'text!tpl/class.html',
  'text!tpl/itemEnd.html',
  // Tools
  'prettify'
], function (_, Backbone, App, itemTpl, classTpl, endTpl) {

  'use strict';

  var itemView = Backbone.View.extend({
    el: '#item',
    init: function () {
      this.$html = $('html');
      this.$body = $('body');
      this.$scrollBody = $('html, body'); // hack for Chrome/Firefox scroll

      this.tpl = _.template(itemTpl);
      this.classTpl = _.template(classTpl);
      this.endTpl = _.template(endTpl);

      return this;
    },
    render: function (item) {
      if (item) {
        var itemHtml = '',
            cleanItem = this.clean(item),
            isClass = item.hasOwnProperty('itemtype') ? 0 : 1,
            collectionName = isClass ? 'Constructor' : this.capitalizeFirst(cleanItem.itemtype),
            isConstructor = cleanItem.is_constructor;
        cleanItem.isMethod = collectionName === 'Method';


        // create syntax string
        var syntax = '';
        if (isConstructor) syntax += 'new ';
        syntax += cleanItem.name;

        if (cleanItem.isMethod || isConstructor) {
          syntax += '(';
          if (cleanItem.params) {
            for (var i=0; i<cleanItem.params.length; i++) { 
              var p = cleanItem.params[i];
              if (p.optional) syntax += '[';
              syntax += p.name;
              if (p.optdefault) syntax += '='+p.optdefault;
              if (p.optional) syntax += ']';
              if (i !== cleanItem.params.length-1) {
                syntax += ',';
              }
            }
          }
          syntax += ')';
        }


        // Set the item header (title)

        // Set item contents
        if (isClass) {
          if (isConstructor) {
            var constructor = this.tpl({
              item: cleanItem,
              syntax: syntax
            });
            cleanItem.constructor = constructor;
          }

          var contents = _.find(App.classes, function(c){ return c.name === cleanItem.name; });
          cleanItem.things = contents.items;

          itemHtml = this.classTpl(cleanItem);

        } else {
          itemHtml = this.tpl({
            item: cleanItem,
            syntax: syntax
          });
        }

        itemHtml += this.endTpl({item:cleanItem});

        // Insert the view in the dom
        this.$el.html(itemHtml);

        renderCode();
        Prism.highlightAll();
      }

      return this;
    },
    /**
     * Clean item properties: url encode properties containing paths.
     * @param {object} item The item object.
     * @returns {object} Returns the same item object with urlencoded paths.
     */
    clean: function (item) {
      var cleanItem = item;

      if (cleanItem.hasOwnProperty('file')) {
        cleanItem.urlencodedfile = encodeURIComponent(item.file);
      }
      return cleanItem;
    },
    /**
     * Show a single item.
     * @param {object} item Item object.
     * @returns {object} This view.
     */
    show: function (item) {
      if (item) {
        this.render(item);
      }

      App.pageView.hideContentViews();

      this.$el.show();

      this.scrollTop();
      //window.scrollTo(0, 0); // LM

      return this;
    },
    /**
     * Show a message if no item is found.
     * @returns {object} This view.
     */
    nothingFound: function () {
      this.$el.html("<p><br><br>Ouch. I am unable to find any item that match the current query.</p>");
      App.pageView.hideContentViews();
      this.$el.show();

      return this;
    },
    /**
     * Scroll to the top of the window with an animation.
     */
    scrollTop: function() {
      // Hack for Chrome/Firefox scroll animation
      // Chrome scrolls 'body', Firefox scrolls 'html'
      var scroll = this.$body.scrollTop() > 0 || this.$html.scrollTop() > 0;
      if (scroll) {
        this.$scrollBody.animate({'scrollTop': 0}, 600);
      }
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

  return itemView;

});