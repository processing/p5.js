var examples = {
  init: function(file) {

    // Editor
    
    examples.editor = ace.edit('exampleEditor');
    //examples.editor.setTheme('ace/theme/monokai'); 
    examples.editor.getSession().setMode('ace/mode/javascript');
    examples.editor.getSession().setTabSize(2); 

    examples.dims = [];

    // Button

    $('#runButton').click( function() { 
    examples.runExample();        
    });
    $('#resetButton').click( function() { 
    examples.resetExample();        
    });

    // Example Frame
    
    $('#exampleFrame').load(function() {
      var exampleCode = examples.editor.getSession().getValue();

      try {       

        if (exampleCode.indexOf('new p5()') === -1) {
          exampleCode += '\nnew p5();';
        }

        if (examples.dims.length < 2) {
          var re = /createCanvas\((.*),(.*)\)/g;
          var arr = exampleCode.split(re);
         $('#exampleFrame').height(arr[2]+'px');
       } else {
         $('#exampleFrame').height(examples.dims[1]+'px');
       }

        var userScript = $('#exampleFrame')[0].contentWindow.document.createElement('script');
        userScript.type = 'text/javascript';
        userScript.text = exampleCode;
        userScript.async = false;
        $('#exampleFrame')[0].contentWindow.document.body.appendChild(userScript);

      } catch (e) {
        console.log(e.message);
      }
    });

  // Capture clicks

  $.ajax({
      url: file,
      dataType: 'text'
    })
    .done(function (data) {
      $('#exampleSelector').hide();
      // strip description 

      var frameRe = /@frame (.*),(.*)/g;
      //var re = /createCanvas\((.*),(.*)\)/g;
      var arr = data.split(frameRe);
      if (arr.length > 2) {
        examples.dims[0] = arr[1];
        examples.dims[1] = arr[2];
      }

      var ind = data.indexOf('*/');
      data = data.substring(ind+3);
      examples.resetData = data;

      examples.showExample();
    })
  },
  showExample: function() {         
    examples.editor.getSession().setValue(examples.resetData); 

    //resize height of editor
    var rows = examples.editor.getSession().$rowLengthCache.length;
    var lineH = examples.editor.renderer.lineHeight;
    $('#exampleEditor').height(rows*lineH+'px');

    examples.runExample();
    $('#exampleDisplay').show();
  },
  runExample: function() {
    $('#exampleFrame').attr('src', $('#exampleFrame').attr('src'));
  },
  resetExample: function() {
    examples.showExample();
  }
}