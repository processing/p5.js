
This is a step-by-step log of setting yourself up as a p5.js contributor, and making a first contribution, 
say a minor documentation correction on a Reference page in p5.js. This supplements the descriptions in ..

  https://github.com/processing/p5.js/blob/master/developer_docs/README.md . . . . # see section Development Process
  https://github.com/processing/p5.js/blob/master/developer_docs/preparing_a_pull_request.md
  https://github.com/processing/p5.js/blob/master/developer_docs/inline_documentation.md 
   
Environment was: MacOS Mojave 10.14.2, Chrome 70.0.3538.110, Node.js 10.15.0, p5.js 0.7.2 (more ?)

There is some detail on possible errors and warnings you might get, and the process reflects the state of the various tools as of 
Jan 2019.
             
<hr>

Here we go ..

Go to https://nodejs.org/en/ 

Download the latest stable general release of Node.js (10.15.0 at time of writing).

Run the install package (node-v10.15.0.pkg).
It will install Node to /usr/local/bin/node, and npm to /usr/local/bin/npm .

(Among other things, Node.js is a standalone JavaScript interpreter, which can be useful. 
Try ..
```
$ node
> let  mult = (x, y) => { return x * y };
> mult(2,3);   // returns 6.
> ctrl-D
```

Note that Node.js is like p5.js, the .js suffix is not a file extension, it's just a way
way to flag the project as a JavaScript one.

Create a GitHub account if you don't have one, at github.com. As usual, you can choose an obvious id, YourName123,
or an anonymous one. I don't think you can be truly anonymous on GitHub, there are too many ways for your personal
information to leak through, and anyway you want the glory, right ?

Login to GitHub, go to the p5.js master repository at:  https://github.com/processing/p5.js

Click "Fork" at upper right to make your own copy of the p5.js repository, in your Github account.
This will be located at https://github.com/your_github_id/p5.js

Clone your fork of p5.js down to your local computer. Typical commands:

```
$ cd                    
$ mkdir github-projects
$ cd github-projects
$ git clone https://github.com/your_github_id/p5.js.git 
# This will create a p5.js folder in your current working folder.

$ cd p5.js       # Work at top level of p5.js from here on
$ npm install    # install stuff p5.js needs from the Node.js universe
# This will install about 600 MByte of tools into p5.js
```
Note, the `git clone` may fail with ..
 `xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun`
In my case this was provoked by upgrading from High Sierra to Mojave in the middle of this work, not smart. Re-install Xcode command-line tools with
`xcode-select --install` and `git clone` will be ok.

The `npm install` may squirt some warnings during the install, such as ..
```
 warning: 'MakeCallback' is deprecated: Use MakeCallback(..., async_context) [-Wdeprecated-declarations]
 warning: 'Int32Value' is deprecated [-Wdeprecated-declarations]
```
These are normal pedantic warnings from the C/C++ compiler and can be ignored.

npm may finish with something like ..
```
added 1362 packages from 1482 contributors and audited 7149 packages in 71.297s
found 16 vulnerabilities (4 low, 10 moderate, 2 high)
  run `npm audit fix` to fix them, or `npm audit` for details
```
AFAIK these can be ignored. Such a large package of tools and code will always
have numerous warnings, but if there are no hard errors you're ok.

Rebuild all of p5.js with ..
```
$ npm run grunt 
```
If you put node_modules/.bin in your searchpath, with say
PATH=$PATH/node_modules/.bin in your ~/.bash_profile, you can shorten this to just ..
```
$ grunt
```
Amongst the output will be some warnings about code and documentation
tests. Most numerous might be many lines of ..
```
 "You must first call texture() before using vertex() with image based u and v coordinates"
``` 
These and other warnings can be ignored: see https://github.com/processing/p5.js/issues/3414

To rebuild and view just the p5.js Reference pages, run:
```
$ grunt yui:dev       ... or
$ npm run docs:dev
```
A browser tab will open automatically with the Reference Pages main page, but if
it doesn't then go to:  http://localhost:9001/docs/reference/

<br>
Now you're ready to start work on your mod to p5.js. The issue would generally already be
listed in the p5.js Issues list, at https://github.com/processing/p5.js/issues, so that the p5.js 
community can comment on whether it really is a bug that needs fixing, or 
an enhancement that's worth doing. If not already listed, you can create the Issue yourself (the New Issue green button on that page).
If in any doubt as to the real value of the proposal, wait a few days for comment to come in.

<br><br>
In this example we edit and correct some reference page material, for example in src/events/keyboard.js. For minor
corrections what to do is obvious; for larger changes see:
  https://github.com/processing/p5.js/blob/master/developer_docs/inline_documentation.md
  
Make your changes (in eg. p5.js/src/events/keyboard.js) and run  ```grunt yui:dev``` again to check the result.

Note, invisible things like trailing blanks on lines may cause the build checks
to fail an `eslint` or `prettier` pass, and show a message like:
```
 Running "eslint:source" (eslint) task
 /Users/yourname/gitprojects/p5.js/src/events/keyboard.js:313:71: Delete `·` [Error/prettier/prettier]
``` 
Probably a bit of regexp code really meant `'  '`. Two trailing spaces will produce a message about `'..'` etc.
(I don't know what's with the backticks. Like that crazy ``quoted' ' style that just won't die). 

<br>

When you're satisfied with all changes, eg. in this case to the Reference page for keyPressed(), in src/events/keyboard.js,
sync it all back to your personal p5.js repository fork on GitHub ..

<br>
First a bunch of command-line work locally:

```
$ git status                
$ git -add u
$ git commit
```
(Here you will be asked to provide a description of the changes you made to keyboard.js)
```
$ git config --global --edit    # add correct email if you need to
```
A couple of these inputs are vi edits, you will need some basic vi commands, woo hoo, vi never dies:
```
 arrow keys to move around,
 i  insert before cursor,   a  insert after cursor,
 A  append at end of line,  o  open the line and insert,  
 ESC to end insert mode,
 x  delete a char,         dd  delete a line,
 :w  write file,  :q  quit,  :wq  write and quit
``` 

Now we start to push stuff back up from local to our GitHub fork ..

``` 
$ git remote show https://github.com/processing/p5.js           # Make sure you're tracking upstream p5.js repository
$ git remote add upstream https://github.com/processing/p5.js   # If not, fix with this

$ git fetch upstream

$ git branch yourname-p5js-backup    # Optional, a backup in case of problems (I don't know what this really does)

$ git rebase upstream/master

$ git push origin
```

<br>
Now we work online in GitHub ..
<br><br>

Go to your personal page on GitHub, and choose your fork of p5.js - this will be at 
https://github.com/your_github_id/p5.js

Make sure you have selected branch "master" to issue the Pull Request against. There are a
couple of Google Summer Of Code branches hanging around - GSOC 17 & 18 - ignore those.

Click "New Pull Request". This generates a request to the maintainers of the master repository,
to look at and merge (pull) your work into the master. It also publishes your mods to the 
community working on p5.js. 

Enter a title for the PR - keep it short and clear, one line, 80 chars or less. This also helps with
tracking emails from GitHub - the email subject will be your title, short is good. You can put
the issue number that the PR addresses in the title, ie. #nnnn.  Look at past PR's to see the style ..

https://github.com/processing/p5.js/pulls?q=is%3Apr+is%3Aclosed

Hit "Submit". Your proposal is now out there for review, and hopefully "merge into master".

End.


