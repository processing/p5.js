function renderCode(sel) {
  var _p5 = p5;
  var instances = [];
  var selector = sel || 'example';
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

  function setupCode(sketch, rc, i) {

    var isRef = sketch.parentNode.tagName !== 'PRE';

    var sketchNode =  isRef ? sketch : sketch.parentNode;
    var sketchContainer = sketchNode.parentNode;

    if (isRef) {
      var pre = document.createElement('pre');
      pre.className = 'ref';
      pre.appendChild(sketchNode);
      sketchContainer.appendChild(pre);
      sketchContainer.className = 'example_container'
      sketch.className = 'language-javascript';
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
      var edit_space = document.createElement('div');
      edit_space.className = 'edit_space';
      sketchContainer.appendChild(edit_space);

      //add buttons
      var edit_button = document.createElement('button');
      edit_button.value = 'edit';
      edit_button.innerHTML = 'edit';
      edit_button.className = 'edit_button';
      edit_space.appendChild(edit_button);
      edit_button.onclick = function(e) {
        if (edit_button.innerHTML === 'edit') { // edit
          setMode(sketch, 'edit');
        } else { // run
          setMode(sketch, 'run');
        }
      }

      var reset_button = document.createElement('button');
      reset_button.value = 'reset';
      reset_button.innerHTML = 'reset';
      reset_button.className = 'reset_button';
      edit_space.appendChild(reset_button);
      reset_button.onclick = function() {
        edit_area.value = orig_sketch.textContent;
        setMode(sketch, 'run');
      };

      var edit_area = document.createElement('textarea');
      edit_area.value = runnable;
      edit_area.rows = rows;
      edit_area.cols = 62;
      // edit_area.position = 'absolute'
      edit_space.appendChild(edit_area);
      edit_area.style.display = 'none';

      enableTab(edit_area);

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
          $('.example_container').each(function(ind, con) {
            $(con).css('opacity', 1.0);
            $(con).removeClass('editing');
          });
          edit_button.innerHTML = 'edit';
          edit_area.style.display = 'none';
          sketch.innerHTML = edit_area.value;
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

        if (runnable.indexOf('setup()') === -1 && runnable.indexOf('draw()') === -1){
          p.setup = function() {
            p.createCanvas(100, 100);
            p.background(200);
            with (p) {
              eval(runnable);
            }
          }
        }
        else {
   
          with (p) {
            eval(runnable);
          }

          var fxns = ['setup', 'draw', 'preload', 'mousePressed', 'mouseReleased', 
          'mouseMoved', 'mouseDragged', 'mouseClicked', 'mouseWheel', 
          'touchStarted', 'touchMoved', 'touchEnded', 
          'keyPressed', 'keyReleased', 'keyTyped'];
          fxns.forEach(function(f) { 
            var ind = runnable.indexOf(f);
            // this is a gross hack within a hacky script that
            // ensures the function names found are not substrings
            // proper use of regex would be preferable...
            if (ind !== -1 && runnable[ind+f.length] === '(') {
              with (p) {
                p[f] = eval(f);
              }
            }
          });

          if (typeof p.setup === 'undefined') {
            p.setup = function() {
              p.createCanvas(100, 100);
              p.background(200);
            }
          }
        }
      };
    }

    //if (typeof prettyPrint !== 'undefined') prettyPrint();
    if (typeof Prism !== 'undefined') Prism.highlightAll();

    $( document ).ready(function() {
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
