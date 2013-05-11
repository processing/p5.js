// make sure Processing core.jar is in your CLASSPATH
// download and put underscore.js next to this file
// pass the working directory as first argument:
// $ java org.mozilla.javascript.tools.shell.Main sketch.js "`pwd`"

var currentDir = arguments[0] || '.',
  sketchWidth = 320,
	sketchHeight = 240, 
	sketchName = 'Underscore test',
	sketchProto = null,
	sketch = null,
	frame = null,
	windowAdapter = null,
	data = JSON.parse( readUrl('http://api.openweathermap.org/data/2.1/forecast/city?q=Frankfurt') ),
	weatherIcons = {};

load(currentDir+'/underscore.js');

sketchProto = {
	setup : function () {
		this.size( sketchWidth, sketchHeight );
		this.background( 255 );
		_.each(data.list,function(d){
			_.each(d.weather,function(w){
				if ( w.icon && !weatherIcons[w.icon] ) {
					weatherIcons[w.icon] = 
						this.loadImage('http://openweathermap.org/img/w/'+w.icon+'.png');
				}
			}, this);
		}, this);
	},
	draw : function () {
		_.each(data.list,function(d){
			_.each(d.weather,function(w){
				if ( w.icon ) {
					this.image( weatherIcons[w.icon], 
								Math.random()*this.width - weatherIcons[w.icon].width, 
								Math.random()*this.height - weatherIcons[w.icon].height );
				}
			}, this);
		},this);
	}
};

sketch = new JavaAdapter( Packages.processing.core.PApplet, sketchProto );

sketch.init();

windowAdapter = new JavaAdapter( Packages.java.awt.event.WindowAdapter, {
   windowClosing: function (evt) {
       system.exit(0);
   }
});

frame = new Packages.java.awt.Frame( sketchName );
frame.addWindowListener( windowAdapter );
frame.add( sketch, Packages.java.awt.BorderLayout.CENTER );
frame.pack();
frame.show();
frame.setSize( new Packages.java.awt.Dimension( sketchWidth, sketchHeight ) );
