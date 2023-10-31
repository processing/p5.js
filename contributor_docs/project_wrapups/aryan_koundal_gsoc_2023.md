# Improving p5.js WebGL/3d functionality

#### By Aryan Koundal(@AryanKoundal)
#### Mentored by : Dave Pagurek(@davepagurek ), Tanvi Kumar(@TanviKumar )

## Overview

In p5.js, there are two render modes: P2D (default renderer) and WebGL. WEBGL enables the user to draw in 3D. There are many ways to implement lightning. Currently, p5js has implemented 8. To add lightning to a 3D object, one can use these functionalities. But there is another technique to light objects, not by direct light, but using the surrounding environment as a single light source, which we call Image-Based Lightning. 
This project aims to add lightning to a 3D object, using the surrounding environment as a single light source, which is generally called Image-Based Lightning. In simple words, one can very quickly drop in an image from real life to use as surrounding lights, rather than continuously tweaking the colors and positions of ambient, point, etc lights.

Tasks for the period of GSOC: 
- Diffused IBL
    - CubeMap Convolution
    - PBR and Irradiance Lighting
- Specular IBL
    - Pre-filtering environment map
    - Pre-computing the BRDF


## Current State of The Project

I have completed the first half of the project tasks which mainly include Diffused IBL feature. This function has been integrated into the p5js repository and is tested as well(manually). ALong with this I have also completed the Pre-filtering environment map prototype and is being integrated to the repository right now.

## What's Left to Do

The major tasks left to do are integrating the Pre filtering environment map and Pre-computing the BRDF sub features in p5js. I also have to add documentation to the newly written functions as well.

## Pull Requests And Work:

- Pull Request: https://github.com/processing/p5.js/pull/6255
- Work Reports:
    - [p5js Week 1 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-1-report-gsoc23-processing-foundation-9910934112e5)
    - [p5js Week 2 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-2-report-gsoc23-processing-foundation-c8a36f5cf34)
    - [p5js Week 3 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-3-report-gsoc23-processing-foundation-39043d0363e2)
    - [p5js Week 4 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-4-report-gsoc23-processing-foundation-a4bc2ff0ac93)
    - [p5js Week 5–6 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-5-6-report-gsoc23-processing-foundation-f07769f76a53)
    - [p5js Week 7–8 Report | GSoC’23 Processing Foundation](https://aryankoundal.medium.com/p5js-week-7-8-report-gsoc23-processing-foundation-1d88a0c05a8e)
    - and more...

## Conclusion

Currently the work is almost on track accoeding to schedule.