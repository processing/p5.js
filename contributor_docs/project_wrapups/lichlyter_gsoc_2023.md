# Updating p5js.org Site Documentation and Accessibility
Project by Kathryn Lichlyter, mentored by Caleb Foss and Paula Isabel Signo

## Overview
This summer, I assisted the Processing Foundation with the navigational and visual accessibility of their p5.js documentation site by by conducting an accessibility audit to gauge the current deficits of the platform, prioritizing what changes and/or additions need to be made to improve accessibility, inclusion, and usability, and seeing those changes through by re-coding and/or re-designing the appropriate aspects of the site. I also contributed a new learn guide for their ARIA labeling functions to assist with screen reader accessibility.

During this GSoC program, I have submitted the following PRs:

- [#1382 Added side-menu links to footer and applied flex-wrap to footer](https://github.com/processing/p5.js-website/pull/1382)
- [#1383 Added label to email input on Community page](https://github.com/processing/p5.js-website/pull/1383)
- [#1384 Added CSS styling for Language button focus state](https://github.com/processing/p5.js-website/pull/1384)
- [#1386 Reference page keyboard accessibility code block fix](https://github.com/processing/p5.js-website/pull/1386)
- [#1407 UI consistency](https://github.com/processing/p5.js-website/pull/1407)
- [#1409 Alt text revisions for non decorative photos](https://github.com/processing/p5.js-website/pull/1409)
- [#1410 Example pages codeblock keyboard trap fix](https://github.com/processing/p5.js-website/pull/1410)
- [#1412 How to label your p5 canvas tutorial](https://github.com/processing/p5.js-website/pull/1412)

## Auditing the p5.js documentation site
During the first weeks of my GSoC project, I audited the existing p5.js documentation site and took note of any features or UI components that did not comply with WCAG AA and COGA standards. As requested by the Processing Foundation team, I took extra care to audit the keyboard and screen reader accessibility of the site. Here is an abridged list of the high-priority issues I found:

### Inaccessible brand colors
The pink brand color (#ED225D) does not have enough contrast on the site’s white background (WCAG 1.4.3). The light gray applied to buttons and the search input is also inaccessible. 

### Inconsistent UI styling
Across the site, there are at least two different secondary button designs-- one of which has insufficient contrast against its background. When I first saw the buttons on the Reference page, I thought they were disabled with how invisible they were against the background. 

Providing a consistent button design to use across the site will help with brand cohesion, predictability, and overall improved navigation. This may involve modifying, improving, or publicizing a design system for all contributors to easily access. 

### Keyboard navigation traps
When navigating the Reference page examples via keyboard or screen reader, the code blocks, if you edit the code, results in a keyboard trap where the user can’t exit the text box. 

Using the Accessibility Insights for Web plugin, I discovered that once someone "tabs" into a code block, they cannot escape (the 'tab' key is re-targeted to a different purpose in the textbox).

### Keyboard navigation reorienting traps
If you select the “Skip to Main Content” button on the Reference example pages, this button redirects a user viewing a function’s Reference page back to the overarching Reference index. My theory is because all of the Reference content exists on the same HTML file, and because the display styling of the item-wrapper apidocs div is changed when the user selects a specific function’s reference, the “Skip to main content page” somehow refreshes any JS-related styling changes and redirects the user back to the Reference index. The same issue with the “lost” tabbing sequence exists on this page as well.

After presenting my audit to the p5.js lead team, we created a list of issues that would be fixable within my GSoC project’s scope (you may view that issue list at [#1372 p5.js Accessibility Audit Discussion](https://github.com/processing/p5.js-website/issues/1372)).

## Expanding the community’s knowledge of web accessibility
The describe() and describeElement() functions provide screen-reader accessible text that explain the p5 canvas and elements inside the p5 canvas. Since this is a fairly recent addition to the p5 library, no existing documentation (outside their References pages) about proper use of these functions is available. This has been brought up in multiple issues in the GitHub Issues page and is currently a part of the Web accessibility next steps page. 

After completing the accessibility audit and submitting my code revisions, I then pivoted my attention to writing a tutorial that would help the p5.js community make their written code more accessible and accommodating for screen readers and other assistive technology. 

The overall objectives of this tutorial were to:

- Make people aware of these new features
- Let people know how to use them
- Indicate the best practices for ARIA labeling, from very simple to very complex and dynamic canvases. (There could also be a section about proper alternative text for highly-interactive and highly-animated sketches and how to best use describeElement() to explain the sketch’s changes.)

At this moment, this tutorial is still going through the process of approval, from both the p5.js lead team and Processing Foundation community. More on this tutorial to come after its approval.

## Next steps
In the future, I will help the p5.js team conduct more usability testing (specifically usability testing with screen readers) and resolve any accessibility issues within my ability. 

Thank you to the whole Processing Foundation team for this wonderful opportunity, and thank you to Claire Kearney-Volpe, Paula Isabel Signo, and Caleb Foss for the great mentoring!
