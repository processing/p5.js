# Implementing missing WebGL primitives
#### by Adil Rabbani ([@adilrabbani](https://github.com/AdilRabbani))

This summer I worked on improving p5.js WebGL mode, along side [Aidan Nelson](https://github.com/AidanNelson) with the help of our mentors [Stalgia Grigg](https://github.com/mlarghydracept)
and [Kate Hollenbach](https://github.com/kjhollen). My tasks for the summer included implementing missing primitives in p5.js WebGL mode i.e arc, point, bezierVertex,
curveVertex, quadraticVertex and text.

## Contribution

My first contribution to p5.js was when I was writing my GSOC proposal. This was just a minor change in [reference examples](https://github.com/processing/p5.js/pull/2737) for curves
and some examples for [vertex()](https://github.com/processing/p5.js/pull/2798). These small changes helped me in understanding the use of grunt, lint, and other node modules being
used in the build process. I was really happy (and surprised) when my proposal got accepted 😄. I was about to contribute to one of my favourite libraries. We had a shared branch on 
[git](https://github.com/processing/p5.js/tree/webgl-gsoc-2018) where we would compare our pull requests to be merged.

### arc

I started by going through [manual examples](https://github.com/processing/p5.js/tree/main/test/manual-test-examples/webgl), debugging them in browser and watching the code jump from 
function to function. I have to admit though, it was a little daunting at first. My first task was to implement arc for WebGL mode and so I decided to go through already implemented ellipse 
and debugging it in the chrome editor.

The code started to make sense after a while and I started to make small changes so as to move forward in implementing arc. Before my first evaluation I was able to implement arc [#2942](https://github.com/processing/p5.js/pull/2942) with all three modes
(OPEN, PIE, CHORD) and add documentation and [test examples](https://github.com/processing/p5.js/tree/webgl-gsoc-2018/test/manual-test-examples/webgl/arc). Ellipse was now refactored by using 
the same arc implementation. This closed issue [#2181](https://github.com/processing/p5.js/issues/2181).

### point

WebGL by default renders square points. Looking through some resources on web gave me an idea of discarding pixels from a square point further to render a circular point. Adding the shader in p5.js was 
relatively simple. But I was stuck on a bug for a while that didn't go off no matter what. Thankfully with the help of my mentor I was able to debug it and come up with a solution.

One small problem was still there though. A good approach on rendering points would be to use the default square point when the size of the point was really small and when it became big enough, it should 
render good looking circular points. I posted this issue on Github and [Adam Ferris](https://github.com/aferriss) who have been working on this before, suggested to use his shader which worked the same way 
as mentioned. Read the discussion [here](https://github.com/processing/p5.js/issues/3017). Finally, I opened a [pull request](https://github.com/processing/p5.js/pull/3031) for point and added two test examples 
for the primitive. This closed issue [#2662](https://github.com/processing/p5.js/issues/2662) and [#2184](https://github.com/processing/p5.js/issues/2184)

### bezierVertex, curveVertex and quadraticVertex

I decided to go for curves next. I went through a great [article](https://pomax.github.io/bezierinfo/) on bezier curves for this task. Reading the article I came to know that a bezier curve can be easily converted 
to Catmull Rom Splines so this meant that if I was able to implement bezierVertex, implementing curveVertex was relatively simple (just converting the points). While quadraticVertex can be implemented by changing the formula used to compute 
coefficients for curves.

I finally added the required functions and started testing curves. Everything worked quite well, except just one. Filling curves gave weird results. At first, I thought maybe there was something wrong going on in 
my code but a further researching revealed that we can't just fill curves with all the intersections and loops without a proper triangulation algorithm. After approval from Kate and Stalgia, I started testing different 
triangulation libraries ([Earcut](https://github.com/mapbox/earcut), [Libtess](https://github.com/brendankenny/libtess.js/), [Tess2](https://github.com/diatomic/tess2)). Earcut was the most precise but wasn't giving correct results.
After a quick discussion with Earcut's creator, it was decided that Earcut wasn't a good option for us.

Tess2 wasn't really a good option either. It wasn't giving correct results and was too big in size. Libtess seemed to work really well and this was also because it was based on the same [GLU Tesselator implementation](https://github.com/processing/processing-android/tree/main/core/src/processing/opengl/tess) that was being used in Processing. The only problem with Libtess was that it was quite bigger than Earcut. We contacted [Lauren](https://github.com/lmccart) 
if it was okay with integrating this library for the triangulation part. She encouraged us by saying that we can add the library as a node module just as opentype was being used for 2D text in p5.js. After integrating libtess, 
I decided to improve the code further for some performance gains. I was able to implement a look up table with the help of which, we wouldn't need to compute coefficients after rendering curve, the first time. This was a huge performance boost from the 
previous trivial implementation. All that was left was to submit a [pull request](https://github.com/processing/p5.js/pull/3085) with an [example](https://github.com/processing/p5.js/tree/webgl-gsoc-2018/test/manual-test-examples/webgl/curves) showcasing what you can do with WebGL curves in p5.js. This closed issues [#2185](https://github.com/processing/p5.js/issues/2185), [#2186](https://github.com/processing/p5.js/issues/2186) and [#2187](https://github.com/processing/p5.js/issues/2187).

### text

Now I had one big task left : Implementing text for p5.js WebGL mode. Let me just mention one thing though, "One does not simply implement text in WebGL 😥"

I went through different methods for rendering text in WebGL. At the end I was able to pick 2 methods that looked perfect for rendering text. The first one was [Signed Distance Field Rendering](http://hack.chrons.me/opengl-text-rendering/). The other being a [GPU based rendering](http://wdobbie.com/post/gpu-text-rendering-with-vector-textures/) approach. After a [discussion](https://github.com/processing/p5.js/issues/2183) on github we decided to go for the GPU based approach. I was not able to implement this approach as [Spongman](https://github.com/Spongman) had already done most of the work for text using the same technique. We decided to pull that implementation and polish it further (looking for bugs, improvements) instead of writing everything from scratch. The pull request is being reviewed [here](https://github.com/processing/p5.js/pull/3110).

### Other minor contributions

Fixed a minor issue with triangle stroke in 2D mode [#3075](https://github.com/processing/p5.js/pull/3075) closing [#3065](https://github.com/processing/p5.js/issues/3065).
Ported some examples from Processing to p5.js [#242](https://github.com/processing/p5.js-website/pull/242).

## Support
Any questions pertaining to this project may be addressed via Issues on the [p5.js repository](https://github.com/processing/p5.js). Simply create a new Issue and either assign or tag me in the conversation with @adilrabbani. For anything else, don't hesitate to get in touch at 14bscsarabbani@seecs.edu.pk!

## Conclusion

I learned a lot this summer. I would like to thank my mentor, [Stalgia Grigg](https://github.com/mlarghydracept) for all the guidance and help throughout the project as well as all the members of Processing Foundation for giving me a chance to contribute
to this library.

Thanks everyone! 😃