var renderCode = function(exampleName) {

  var _p5 = p5;
  var instances = [];
  var selector = 'example';
  var examples = document.getElementsByClassName(selector);
  if (examples.length > 0) {

    var sketches = examples[0].getElementsByTagName('code');
    var sketches_array = Array.prototype.slice.call(sketches);
    var i = 0;
    sketches_array.forEach(function(s) {
      var rc = (s.parentNode.className.indexOf('norender') === -1);
      setupCode(s, rc, i);
      runCode(s, rc, i);
      i++;
    });
  }

  function enableTab(el) {
    el.onkeydown = function(e) {
      if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var val = this.value,
            start = this.selectionStart,
            end = this.selectionEnd;
        // set textarea value to: text before caret + tab + text after caret
        this.value = val.substring(0, start) + '  ' + val.substring(end);
        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 2;
        // prevent the focus lose
        return false;

      }
    };
  }

  function setupCode(sketch, rc, i) {

    var isRef = sketch.parentNode.tagName !== 'PRE';
    var sketchNode =  isRef ? sketch : sketch.parentNode;
    var sketchContainer = sketchNode.parentNode;

    if (isRef) {
      $(sketchContainer).prepend('<h4 id="example'+i+'" class="sr-only">'+exampleName+' example '+i+'</h4>');
      var pre = document.createElement('pre');
      pre.className = 'ref';
      pre.appendChild(sketchNode);
      sketchContainer.appendChild(pre);
      sketchContainer.className = 'example_container';
      sketch.className = 'language-javascript';
      if (!rc) {
        pre.className += ' norender';
      }
    }


    // remove start and end lines
    var runnable = sketch.textContent.replace(/^\s+|\s+$/g, '');
    var rows = sketch.textContent.split('\n').length;

    // var h = Math.max(sketch.offsetHeight, 100) + 25;

    // store original sketch
    var orig_sketch = document.createElement('div');
    orig_sketch.innerHTML = sketch.innerHTML;

    // create canvas
    if (rc) {
      var cnv = document.createElement('div');
      cnv.className = 'cnv_div';
      if (isRef) {
        sketchContainer.appendChild(cnv);
      } else {
        sketchContainer.parentNode.insertBefore(cnv, sketchContainer);
      }

      // create edit space
      let edit_space = document.createElement('div');
      edit_space.className = 'edit_space';
      sketchContainer.appendChild(edit_space);
      $(edit_space).append('<h5 class="sr-only" id="buttons"'+i+' aria-labelledby="buttons'+i+' example'+i+'">buttons</h5>');

      var edit_area = document.createElement('textarea');
      edit_area.value = runnable;
      edit_area.rows = rows;
      edit_area.cols = 62;
      edit_area.style.position = 'absolute'
      edit_area.style.top = '4px';
      edit_area.style.left = '13px';
      edit_space.appendChild(edit_area);
      edit_area.style.display = 'none';
      enableTab(edit_area);

      //add buttons
      let button_space = document.createElement('ul');
      edit_space.appendChild(button_space);
      let edit_button = document.createElement('button');
      edit_button.value = 'edit';
      edit_button.innerHTML = 'edit';
      edit_button.id = 'edit'+i;
      edit_button.setAttribute('aria-labelledby', edit_button.id+' example'+i);
      edit_button.className = 'edit_button';
      edit_button.onclick = function(e) {
        if (edit_button.innerHTML === 'edit') { // edit
          setMode(sketch, 'edit');
        } else { // run
          setMode(sketch, 'run');
        }
      };
      let edit_li = button_space.appendChild(document.createElement('li'));
      edit_li.appendChild(edit_button);

      let reset_button = document.createElement('button');
      reset_button.value = 'reset';
      reset_button.innerHTML = 'reset';
      reset_button.id = 'reset'+i;
      reset_button.setAttribute('aria-labelledby', reset_button.id+' example'+i);
      reset_button.className = 'reset_button';
      reset_button.onclick = function() {
        edit_area.value = orig_sketch.textContent;
        setMode(sketch, 'run');
      };
      let reset_li = button_space.appendChild(document.createElement('li'));
      reset_li.appendChild(reset_button);

      let copy_button = document.createElement('button');
      copy_button.value = 'copy';
      copy_button.innerHTML = 'copy';
      copy_button.id = 'copy'+i;
      copy_button.setAttribute('aria-labelledby', copy_button.id+' example'+i);
      copy_button.className = 'copy_button';
      copy_button.onclick = function() {
        setMode(sketch, 'edit');
        edit_area.select();
        document.execCommand('copy');
      };
      let copy_li = button_space.appendChild(document.createElement('li'));
      copy_li.appendChild(copy_button);


      function setMode(sketch, m) {
        if (m === 'edit') {
          $('.example_container').each(function(ind, con) {
            if (ind !== i) {
              $(con).css('opacity', 0.25);
            } else {
              $(con).addClass('editing');
            }
          });
          edit_button.innerHTML = 'run';
          edit_area.style.display = 'block';
          edit_area.focus();
        } else {
          edit_button.innerHTML = 'edit';
          edit_area.style.display = 'none';
          sketch.textContent = edit_area.value;
          $('.example_container').each(function (ind, con) {
            $(con).css('opacity', 1.0);
            $(con).removeClass('editing');
            $this = $(this);
            var pre = $this.find('pre')[0];
            if (pre) {
              $this.height(Math.max($(pre).height(), 100) + 20);
            }
          });
          runCode(sketch, true, i);
        }
      }
    }
  }

  function runCode(sketch, rc, i) {

    if (instances[i]) {
      instances[i].remove();
    }

    var sketchNode = sketch.parentNode;
    var isRef = sketchNode.className.indexOf('ref') !== -1;
    var sketchContainer = sketchNode.parentNode;
    var parent = sketchContainer.parentNode;

    var runnable = sketch.textContent.replace(/^\s+|\s+$/g, '');
    var cnv;

    if (rc) {
      if (isRef) {
        cnv = sketchContainer.getElementsByClassName('cnv_div')[0];
      } else {
        cnv = parent.parentNode.getElementsByClassName('cnv_div')[0];
      }
      cnv.innerHTML = '';

      var s = function( p ) {
        var fxns = ['setup', 'draw', 'preload', 'mousePressed', 'mouseReleased',
          'mouseMoved', 'mouseDragged', 'mouseClicked', 'mouseWheel',
          'touchStarted', 'touchMoved', 'touchEnded',
          'keyPressed', 'keyReleased', 'keyTyped'];
        var _found = [];
        // p.preload is an empty function created by the p5.sound library in order to use the p5.js preload system
        // to load AudioWorklet modules before a sketch runs, even if that sketch doesn't have its own preload function.
        // However, this causes an error in the eval code below because the _found array will always contain "preload",
        // even if the sketch in question doesn't have a preload function. To get around this, we delete p.preload before
        // eval-ing the sketch and add it back afterwards if the sketch doesn't contain its own preload function.
        // For more info, see: https://github.com/processing/p5.js-sound/blob/master/src/audioWorklet/index.js#L22
        if (p.preload) {
          delete p.preload;
        }
        with (p) {
          // Builds a function to detect declared functions via
          // them being hoisted past the return statement. Does
          // not execute runnable. Two returns with different
          // conditions guarantee a return but suppress unreachable
          // code warnings.
          eval([
            '(function() {',
              fxns.map(function (_name) {
                return [
                  'try {',
                  '  eval(' + _name + ');',
                  '  _found.push(\'' + _name + '\');',
                  '} catch(e) {',
                  '  if(!(e instanceof ReferenceError)) {',
                  '    throw e;',
                  '  }',
                  '}'
                ].join('');
              }).join(''),
              'if(_found.length) return;',
              'if(!_found.length) return;',
              runnable,
            '})();'
          ].join('\n'));
        }
        // If we haven't found any functions we'll assume it's
        // just a setup body with an empty preload.
        if (!_found.length) {
          p.preload = function() {};
          p.setup = function() {
            p.createCanvas(100, 100);
            p.background(200);
            with (p) {
              eval(runnable);
            }
          }
        } else {
          // Actually runs the code to get functions into scope.
          with (p) {
            eval(runnable);
          }
          _found.forEach(function(name) {
            p[name] = eval(name);
          });
          // Ensure p.preload exists even if the sketch doesn't have a preload function.
          p.preload = p.preload || function() {};
          p.setup = p.setup || function() {
            p.createCanvas(100, 100);
            p.background(200);
          };
        }
      };
    }

    //if (typeof prettyPrint !== 'undefined') prettyPrint();
    if (typeof Prism !== 'undefined'){
      Prism.highlightAll()
    };

    // when a hash is changed, remove all the sounds,
    // even tho the p5 sketch has been disposed.
    function registerHashChange() {
      window.onhashchange = function(e) {
        for (var i = 0; i < instances.length; i++) {
          instances[i].remove();
        }
      }
    }

    $( document ).ready(function() {

      registerHashChange();

      setTimeout(function() {
        var myp5 = new _p5(s, cnv);
        $( ".example-content" ).find('div').each(function() {
          $this = $( this );
          var pre = $this.find('pre')[0];
          if (pre) {
            $this.height( Math.max($(pre).height()*1.1, 100) + 20 );
          }
        });
        instances[i] = myp5;
      }, 100);
    });

  }

};
