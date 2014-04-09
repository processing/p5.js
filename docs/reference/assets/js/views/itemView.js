define([
  'underscore',
  'backbone',
  'App',
  // Handlebars
  'handlebars',
  // Templates
  'text!tpl/item.html',
  'text!tpl/class.html',
  // Handlebars templates
  'text!tpl/method.handlebars',
  'text!tpl/event.handlebars',
  'text!tpl/property.handlebars',
  //'text!tpl/class.handlebars',
  // Tools
  'prettify'
], function(_, Backbone, App, Handlebars, itemTpl, classTpl, methodTpl, eventTpl, propertyTpl) {

  var itemView = Backbone.View.extend({
    el: '#item',
    init: function() {
      this.tpl = _.template(itemTpl);
      this.classTpl = _.template(classTpl);
     
      this.methodTpl = Handlebars.compile(methodTpl);
      this.eventTpl = Handlebars.compile(eventTpl);
      this.propertyTpl = Handlebars.compile(propertyTpl);
      //this.classTpl = Handlebars.compile(classTpl);

      return this;
    },
    render: function(item) {
      if (item) {
        var itemHtml = '',
                cleanItem = this.clean(item),
                isClass = item.hasOwnProperty('itemtype') ? 0 : 1,
                collectionName = isClass ? 'Constructor' : this.capitalizeFirst(cleanItem.itemtype),
                isConstant = !isClass ? cleanItem.final : 0,
                isConstructor = cleanItem.is_constructor;

        // Set the item header (title)
        itemHtml = this.tpl({
          item: cleanItem,
          name: cleanItem.name,
          collectionName: collectionName,
          isClass: isClass,
          isConstant: isConstant,
        });

        // Set item contents
        if (isClass) {
          if (isConstructor) {
            cleanItem.isConstructor = isConstructor;
            var constructor = this.methodTpl(cleanItem);
            cleanItem.constructor = constructor;
          }
          itemHtml += this.classTpl(cleanItem);
        } else if (item.itemtype === 'method') {
          itemHtml += this.methodTpl(cleanItem);
        } else if (item.itemtype === 'event') {
          itemHtml += this.eventTpl(cleanItem);
        } else if (item.itemtype === 'property') {
          itemHtml += this.propertyTpl(cleanItem);
        }

        // Insert the view in the dom
        this.$el.html(itemHtml);
        
        // Prettify code (syntax highlighter)
        this.$el.find('code').addClass('prettyprint');
        prettyPrint();
      }

      return this;
    },
    /**
     * Clean item properties: url encode properties containing paths.
     * @param {object} item The item object.
     * @returns {object} Returns the same item object with urlencoded paths.
     */
    clean: function(item) {
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
    show: function(item) {
      if (item)
        this.render(item);

      App.pageView.hideContentViews();

      this.$el.show();

      return this;
    },
    /**
     * Show a message if no item is found.
     * @returns {object} This view.
     */
    nothingFound: function() {
      this.$el.html("<p><br><br>Ouch. I am unable to find any item that match the current query.</p>");
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
    }
  });

  return itemView;

});