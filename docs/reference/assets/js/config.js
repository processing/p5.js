var require = {
  baseUrl: "assets/js",
  paths: {
    //'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
    'jquery': 'vendor/jquery/jquery-1.11.0',
    'underscore': 'vendor/underscore-amd/underscore.min',
    'backbone': 'vendor/backbone-amd/backbone.min',
    // Require plugins
    'text': 'vendor/require/text',
    'domReady': 'vendor/require/domReady',
    // Twitter typeahead + bloodhound
    'typeahead': 'vendor/typeahead-amd/typeahead.bundle',
    //'bloodhound': 'vendor/typeahead-amd/',
    
    'handlebars': 'vendor/handlebars/handlebars-v1.3.0',
    'prettify': 'vendor/prettify/prettify',
//    'prism': 'vendor/prism/prism',

    // Collections
    'itemsCollection': 'collections/itemsCollection',
    // Models
    'itemModel': 'models/itemModel',
    // Views
    'listView': 'views/listView',
    'itemView': 'views/itemView',
    'searchView': 'views/searchView',
    'pageView': 'views/pageView',
    'fileView': 'views/fileView',
    'menuView': 'views/menuView'
  }
};