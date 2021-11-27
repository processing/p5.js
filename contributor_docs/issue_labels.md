# p5.js issue labels

p5.js uses a set of labels to help sort and organize issues.

All issues should have labels applied to indicate severity, level of difficulty, and which components/areas are affected. Additional status tags may be applied to indicate a resolution or type of bug (for example, duplicate issues).

## Status

Label               | Usage
------------------- | -------------
help_wanted         | Not sure how to fix, looking for contribution, easy access point for people (indicates issue can be claimed by new developer
inconsistent_style  | Unclean code, confusing syntax, maybe insufficient documentation
duplicate           | Issue already noted elsewhere
missing_test        | Feature or API in need of automated test
wont_fix            | Legitimate issue, but won't be addressed due to community agreed upon scope
gsoc                | problem already being addressed by Google Summer of Code
invalid             | No longer relevant (for example, feature request in old API), not actually a problem
discussion          | Know what the problem is, need community input to determine solution
question            | Not sure what problem is/if there is a problem, requires clarification
feature    | An addition or improvement to the codebase
regression | Function/feature once worked, but has since broken. Useful for identifying unstable features or components


## Severity
Classify the bug's impact on p5.js users and developers.

Label               | Usage
------------------- | -------------
severity:critical   | Blocks work of other developers (for example a broken build); or causes data loss for a library or IDE user
severity:major      | Loss of functionality in an important component
severity:minor      | A small item not likely to be seen by many users; or something that will only be a minor annoyance if encountered by a user; or something with a known work-around

## Difficulty Level
Tag bugs and feature requests according to difficulty level. Help identify bugs that can be tackled by beginners or new contributors, or items that will take substantial effort even from experienced contributors.

Label               | Usage
------------------- | -------------
level:bite size     | Easily squashed, could be tackled by a new/junior developer
level:moderate      | Requires a sizable amount of work or familiarity with code base
level:advanced      | Requires a large amount of work and possibly an invasive fix or re-architecture
level:unknown       | Difficulty not known by person filing the issue

## Area
Indicate the part of the code base affected by the issue.

* area:3d
* area:color
* area:core
* area:documentation
* area:dom
* area:events
* area:examples
* area:image 
* area:io 
* area:math 
* area:tutorial 
* area:typography

## OS/Browser
When an issue affects ONLY a specific operating system and/or browser, tag the issue appropriately.

* chrome
* ie
* safari
* opera
* firefox
* android
* ios
* windows_mobile
* windows
* osx
* linux