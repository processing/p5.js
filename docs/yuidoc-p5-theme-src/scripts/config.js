var require = {
  baseUrl: "assets/js",
  paths: {
    'jquery': [
      '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
      'vendor/jquery/jquery-1.11.0'
    ],
    'underscore': 'vendor/underscore-amd/underscore',
    'backbone': 'vendor/backbone-amd/backbone',
    // Require plugins
    'text': 'vendor/require/text',
    'domReady': 'vendor/require/domReady',
    // Twitter typeahead + bloodhound
    'typeahead': 'vendor/typeahead-amd/typeahead.bundle',
    //'bloodhound': 'vendor/typeahead-amd/',
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
    'menuView': 'views/menuView',
    'libraryView': 'views/libraryView'
  }
};