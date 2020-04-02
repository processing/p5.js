# Designing a test strategy to maintain and update mobile usability of p5.js (by [@LadySith](https://github.com/LadySith))

## Summary

The main goal of my project was to design a test strategy and extensively test and update the p5.js mobile functionality so that compatibility issues can be tracked easily with updates to the library and mobile platforms. A lot of the project involved performing my own visual tests on various devices both real and virtual.

Part of this project included a testing event in the form of a creative coding workshop in Port Elizabeth, South Africa that will allow users to learn and test the mobile functionality of p5.js as well as possibly catch further issues on unfamiliar devices.

As part of the project I also attended to some minor issues on Github.


## Sumbission contains:

### 1. [Attending to p5.js mobile issues](https://github.com/processing/p5.js/labels/area%3Amobile)

Here I looked into the existing issues marked area:mobile and closed issues 3003 and 2751

### 2. [Compilation of visual tests UI tests of all examples using testingbot as a crossbrowser tester](https://drive.google.com/open?id=18KFN2FEeeaRcO3-cKRupA_Atc7_EK8cH)

This folder contains visual screenshots of each example from the p5.js reference page as an example of visual UI tests for mobile performance. The screenshots are captured for the p5.js website accessed on iPhone 6, iPad 2 and Galaxy S4.

### 3. [Spreadsheet containing behavior encountered during live and emulated testing](https://docs.google.com/spreadsheets/d/1lLyFKmlT7l8ANvAVXYEiLj9-9kKhBiMXKNjZD2mBt5c/edit?usp=sharing)

This serves as a guideline to what was extensively tested and what new issues were and will be created from performing mobile tests on given sets of data.

### 4. Medium articles reporting work done during first and second month
- [1st month](https://medium.com/@_LadySith/designing-a-test-strategy-for-updating-mobile-functionality-of-p5-js-part-1-a8fe5a212e96)
- [2nd month](https://medium.com/@_LadySith/a-test-strategy-for-updating-mobile-functionality-of-p5-js-part-2-71c9f8f9af25)


### 5. [Content created for creative coding workshop](https://drive.google.com/drive/folders/1fVq3ufqNyeAvFotNYLdKSXmKe0rko0cD)
This content was created for a creative coding workshop in Port Elizabeth South Africa teaching school girls of various backgrounds coding using p5.js on both desktop and tablet.


## Impediments
I experienced a lot of trouble working with npm and grunt to resolve p5.js-website mobile issues. I am still trying to fix the dependencies so I can finish this part of the work. There are two issues that I feel are very necessary to close to improve the mobile usability of people accessing the p5.js website.

## To be completed after submission
- Closing of issues related to mobile website performance
- Recommended feature for addition to
- Completing final medium article after the closing of the above issues

## Conclusion

The project served to extensively test mobile usability of p5.js by going through examples and create a starting point to discovering more mobile issues. During this project went through all mobile examples and tested them on various live and emulated devices. I would recommend as a next step testing interactions using the Reference page and finding a way to automate visual UI tests. This is something I would like to explore in my spare time.

## Acknowledgements

Thanks to my mentor Lee Tusman for his support and insight as I worked through this project, to Lauren McCarthy for creating this library and assisting me with my work on the p5.js-website repository as well as all members of the p5.js community for allowing me to contribute and explore open source for the first time.
