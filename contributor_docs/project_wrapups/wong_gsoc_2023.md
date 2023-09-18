# Supporting shader-based filters in p5js

By [Justin Wong](https://wonger.dev)

| Faster image filters | Less boilerplate for shader code |
|-|-|
| <video src="https://github.com/wong-justin/p5.js/assets/28441593/41edb6b9-ef4c-4b2e-8b22-2237da4617d9">filter(), before and after</video> | ![2D shader setup, before and after](https://github.com/wong-justin/p5.js/assets/28441593/6bbd1627-3a01-4911-8c5c-992d63538b96) |
| [old filter() sketch](https://editor.p5js.org/jwong/sketches/oG9AOomYm) | [old 2D shader sketch](https://editor.p5js.org/jwong/sketches/ehXcWtycm) |
| [new filter() sketch](https://editor.p5js.org/jwong/sketches/nWmTF8UED) | [new 2D shader sketch](https://editor.p5js.org/jwong/sketches/T96caQxWq) |

My work centered around the `filter()` function because it was too slow.
I made it faster by using shaders, which are programs that use the GPU for image processing. 
Now people can use effects like blur without noticing such a drop in performance.

There were some secondary accomplishments as well.
There's a new function `createFilterShader()` that makes writing shaders easier.
I helped revise a few documentation pages.
I also tried to contribute some benchmarking tools, but that was a bit ambitious.
All of these changes make shaders and image filters more accessible. 

I enjoyed the experience and learned a lot.
In fact, I learned so much that I wrote [another post](https://wonger.dev/posts/gsoc.html) on my website.
That post is more about the GSoC experience in general, especially aimed at newcomers, and not so much about p5js details.

Many thanks to my mentors for all their support: Adam Ferriss, Austin Slominski, and So Sun Park. Thanks also to other maintainers like Dave Pagurek, Kenneth Lim, and Qianqian Ye for helping along the way.

## Work Completed

- [Initial pull request](https://github.com/processing/p5.js/pull/6167), just some documentation. Status: merged
- [Second pull request](https://github.com/processing/p5.js/pull/6237), mostly internal changes to enable new shaders. Status: merged
- [Third pull request](https://github.com/processing/p5.js/pull/6324), replacing the old filters with new shader filters. Status: merged

### Public documentation pages:
- [WEBGL](https://p5js.org/reference/#/p5/WEBGL) -  Status: merged, page created
- [filter()](https://p5js.org/reference/#/p5/filter) - Status: merged, page not updated yet
- [createFilterShader()](https://p5js.org/reference/#/p5/createFilterShader) - Status: merged, page not created yet

### Performance measuring helpers:

- [JSPerf benchmarks](https://jsperf.app/sideci) for comparing two different p5js builds. Status: flopped. It was difficult to set up the tests inside the sketch, and results were inconclusive

## Potential improvements:

1. I think there should be some refactoring to cut down on all the graphics layers swimming around - maybe by using framebuffers, or maybe just by understanding and wrangling the canvases better. 
2. There's some alternative blur filters worth investigating. There's an issue opened now to try for a better quality gaussian blur shader that still adjusts according to user input.
3. Performance could still be improved. Filters in WEBGL mode work well, getting 60 fps on my machine. But transferring filtered content to a default P2D renderer from a hidden WEBGL renderer results in about 20 fps. It also seems like performance suffers on mobile GPUs.
