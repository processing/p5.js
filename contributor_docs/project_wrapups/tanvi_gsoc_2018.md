# Improvements to existing I/O Methods of p5.js 
### by Tanvi Kumar ([@TanviKumar](https://github.com/TanviKumar))

## Summary

My project for GSoC'18 initially revolved around looking into the I/O methods and trying to resolve the existing issues related to them. It later moved into closing issues related to WebGL and many old I/O issues were resolved.

Throughout the three months, I've been able to modify code, add new features, add examples and make changes to documentation. A lot of my time was spent testing the methods on different browsers, replicating open issues to help resolve them and finding solutions for issues.

## Contributions during GSoC'18 

### Testing I/O methods

The first coding period of GSoC'18 was spent analysing and testing the I/O methods on different browsers and also testing their examples.
On testing these methods, a common issue regarding the size of files to be fetched was found for the loading methods of p5.js. 
[#2981](https://github.com/processing/p5.js/issues/2981) clearly encapsulated the other issues [#2661](https://github.com/processing/p5.js/issues/2661) and [#2216](https://github.com/processing/p5.js/issues/2216) regarding this. 
It was found that browsers like Chrome can easily fetch large files despite taking a lot of time, however old versions of browsers like Firefox can fetch files up to a maximum of 64MB in one request. A size allocation limit error would be reached if the file is too big.

Various ideas were looked into to try and find appropriate solutions to these issues.
These included - 
Adding the knowledge of the size limit of browsers to the documentation,
Generating errors before fetching lare files
Using HEAD requests to get the size of the file then producing an error if limit was exceeded and finally, 
To fetch the file anyway in case a certain browser can handle it and issue a warning to the user. 
The final discussions have led to [#3217](https://github.com/processing/p5.js/pull/3127).
The documentation for the loading methods will now warn the users regarding the issue about size limit and also give the user a friendly error if a large file is being fetched just so they may be informed.
The friendly error system (FES) of p5.js was used to do this. 

Some issues involved trying to replicate them so they may be fixed, including issue [#2842](https://github.com/processing/p5.js/issues/2842) and [#1829](https://github.com/processing/p5.js/issues/1829).

### New feature

A method to add the HTML DOM input color object was created and successfully merged in [#3089](https://github.com/processing/p5.js/pull/3089).
This was done to close the [#2504](https://github.com/processing/p5.js/issues/2504).
It can give the user the hex string color value of the input element and also a p5.Color object with the chosen color so that it may be easily integrated into sketches that use methods which accept p5.Color objects like lerpColor method in p5.js.

### New examples and documentation

- Added a new example and fixed the old example of the loadModel method in [#2968](https://github.com/processing/p5.js/pull/2968). This was to close the[#2904](https://github.com/processing/p5.js/issues/2904) .
- Changed the model() example in [#3074](https://github.com/processing/p5.js/pull/3074)
- Added the example and manual test example for createColorPicker method in [#3089](https://github.com/processing/p5.js/pull/3089)

## Conclusion

GSoC'18 was an incredibly enriching experience. I'm happy to know that I was able to successfully contribute to p5.js and close numerous issues and hope that my work will continue to do so in the future. I'd also like to add that I'd love to continue being a part of p5.js in the future after these fulfilling 3 months.

## Acknowledgements

I'd like to thank my mentor, [Alice Mira Chung](https://github.com/almchung) for her guidance, patience and support. I'd also like to thank Lauren McCarthy and others in the p5.js community who helped me successfuly close issues and guided me when I stumbled. Really grateful for having had this oppurtunity and such an encouraging environment.