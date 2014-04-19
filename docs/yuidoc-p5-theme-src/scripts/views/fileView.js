define([
  'underscore',
  'backbone',
  'App',
  // Handlebars
  'handlebars',
  // Handlebars templates
  'text!tpl/file.handlebars',
  // Tools
  'prettify'
], function(_, Backbone, App, Handlebars, fileTpl) {

  var fileView = Backbone.View.extend({
    el: '#file',
    /**
     * Init.
     * @returns {object} This view.
     */
    init: function() {
      this.p5RepoUrl = 'https://api.github.com/repos/lmccart/p5.js/contents/';
      this.fileTpl = Handlebars.compile(fileTpl);

      return this;
    },
    /**
     * Render the view.
     * @param {type} filepath
     * @param {type} line
     * @returns {object} This view.
     */
    render: function(filepath, line) {
      if (filepath && line) {
        var self = this,
                fileHtml,
                realPath = decodeURIComponent(filepath).replace('../', '');

        $.ajax({
          'url': self.p5RepoUrl + realPath,
          'dataType': 'jsonp',
          'success': function(response) {
            var fileData = response.data.content;
            if (fileData) {
              fileHtml = self.fileTpl({
                'fileName': realPath,
                'fileData': atob(fileData),
                'line': line
              });
              
              // Insert the view in the dom
              self.$el.html(fileHtml);
              
              // Prettify code (syntax highlighter)
              prettyPrint();
              
              // Highlight line
              self.$el.find('.linenums > li')
                      .eq(parseInt(line)-1)
                      .addClass('highlight');
            }
          }
        });
      }

      return this;
    },
    /**
     * Show a single item.
     * @param {object} item Item object.
     * @returns {object} This view.
     */
    show: function(filepath, line) {
      if (filepath && line)
        this.render(filepath, line);

      App.pageView.hideContentViews();
      this.$el.show();

      return this;
    },
    /**
     * Show a message if no item is found.
     * @returns {object} This view.
     */
    nothingFound: function() {
      this.$el.html("<p><br><br>Ouch. I am unable to find the file you are looking for. Please check the path.</p>");
      App.pageView.hideContentViews();
      this.$el.show();

      return this;
    }
  });

  return fileView;

});