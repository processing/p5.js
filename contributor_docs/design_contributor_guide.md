# Design Contributor Guide

You can improve how p5js.org looks, reads and works without writing code. This guide covers how design work on the site gets done, from proposing a change to getting it reviewed, and gives you templates for each step. It is the design companion to the [contributor guidelines](https://p5js.org/contribute/contributor_guidelines/), which stay the reference for issues, pull requests and code. Stewards can use the [steward guidelines](https://p5js.org/contribute/steward_guidelines).

Each step shows how it was done in a summer 2026 usability study of the site's search and navigation, then what you can do. The study's main result: nobody knew the site has several tools, because global search, the reference filter and Jump To look alike but do different jobs. The full study is in the [usability reports](#usability-reports).

**On this page:** [Proposing a design change](#proposing-a-design-change) · [What you need](#what-you-need) · [One way to work](#one-way-to-work) · [Personas](#personas) · [Design standards](#design-standards) · [Submitting and review](#submitting-and-review) · [Reports](#usability-reports)

## Proposing a design change

Design work starts as a GitHub issue. Find one labeled [UX/design](https://github.com/processing/p5.js-website/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22UX%2Fdesign%22), or ask in `#contribute-to-p5` on [Discord](https://discord.p5js.org) for an older issue to be labeled. Read the finding-issues-using-labels section of the contributor guidelines first, then the [AI usage policy](https://github.com/processing/p5.js/blob/main/AI_USAGE_POLICY.md).

Say why, not only what. Maintainers can act on an issue much faster when it shows the reason and the expected result. When you open an issue, include the reason, who it affects, your evidence, and a screenshot of what you expect. The [issue note template](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk) has these fields.

**Do not open a pull request until a steward or maintainer approves the issue.**

Changes to the reference categories come from doc strings in the main p5.js repository, so propose those there, as a separate project.

## What you need

A GitHub account, a free Figma account, and an open issue. The [public Figma file](https://www.figma.com/design/6cVZhBiEUl9BvsFAG5FgIA/p5.js-Website-Navigation-and-Search-Redesign--Work-in-Progress-) holds the site's components and tokens, and opens on a cover page with duplication steps. Duplicate it to your own drafts and design on your copy. Don't edit the original. You can also ask the team for the design system file, or use this one, which was created by a contributor.

To learn the site, see the [website docs](https://github.com/processing/p5.js-website/tree/main/docs), the [technical overview](https://github.com/processing/p5.js-website/blob/main/docs/technical_overview.md) and the [localization guide](https://github.com/processing/p5.js-website/blob/main/docs/localization.md).

## One way to work

This workflow is an option, shown with the 2026 study. Use your own if you have one. Every template mentioned is a section of one [templates file](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk).

**1. Watch people use the site.** The study used a screener survey to recruit a mix of educators, students and long-time users, then ran short moderated sessions where each person thought aloud while doing tasks such as finding a way to play a sound. To do the same, copy the [screener survey](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk), the [scenario and task cards](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk) and the [moderator script](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk). Run them again after major releases, so findings stay current.

**2. Find the patterns.** In the study, every place someone got stuck became a code, and the codes were grouped on an affinity map. One person's trouble is a story. The same trouble twice is a finding. To do the same, use the [coding and theming guide](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk). The result was a finding about the tools themselves. One participant said the filter "just looks like a heading, not something you can interact with."

**3. Check what is broken.** Sessions show what feels confusing, not what is broken. The study also ran the same searches against the real code, and found a Windows bug that broke most result links, which no participant had mentioned. To do the same, use the [local functional test](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk), then sort each finding with the [problem type checklist](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk). It tells you whether you need a redesign or a bug fix, and who should fix it.

**4. Design on your copy** with the existing components and tokens, then check it against the standards below.

## Personas

Use personas to check a design: would this person understand it? These are the ones we have so far:

- **The Learner** is building understanding from scratch. They type everyday words, and turn to a search engine or an AI tool when search fails.
- **The Teacher** is preparing a lesson or answering a question live. They work from examples, and need pages that are easy to share and read aloud.
- **The Maker** is finishing something of their own. They know the idea but not always the name, and want the right function or example quickly.
- **The Contributor** is improving p5.js, its docs or its website. They read closely and check the reference against the code.
- **The Curious Visitor** is deciding whether p5.js is for them. They need a clear first step and a quick, visible result.

Don't see who you are designing for? Tell us in `#contribute-to-p5` on [Discord](https://discord.p5js.org) and create your own with the [blank persona template](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk). Start from a goal, collect evidence from at least two sources, use people's own words, and say how strong the evidence is. Check every persona against experience level, language, device and access needs.

## Design standards

Hold your design to these, whatever you are designing:

- **Accessible.** Meet WCAG 2.1 AA, and run the [accessibility checklist](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk).
- **Consistent.** Reuse existing components and tokens before creating new ones.
- **Clear.** What is clickable looks clickable, with a visible hierarchy.
- **Complete.** Design hover, focus, empty, error and no-results states.
- **Plain.** Short, concrete words that say what to do next.
- **Responsive.** Show mobile, tablet and desktop.

p5.js also has its own design principles, in the contributor guidelines. Run the [review checklist](https://drive.google.com/file/d/16VmesCZjrDKRqfWPhXzsJgikPkskGGKD/view?usp=drivesdk) before you submit.

## Submitting and review

When your issue is approved, open a pull request as the contributor guidelines describe. For design work, include the issue number, the reason for the change, the Figma frame and a screenshot, and your completed checklists. Keep one decision per pull request.

A steward or maintainer will review it, which can take several days. Expect questions, especially on color and accessibility, and revise. Community comments improved the 2026 design.

## Usability reports

This list holds usability reports. After you run a study, add your report below with its date, newest first. Findings were last validated in summer 2026, so re-check them if the navigation or reference filter changes structurally.

- [Search, navigation and menu usability report (2026)](https://drive.google.com/file/d/1eUjg2exEduRvwjs-qHjGXp2A3dHSe4Qo/view?usp=drivesdk)
- Earlier usability reports, linked from [issue #1221](https://github.com/processing/p5.js-website/issues/1221).

The [Community Survey data](https://github.com/processing/data/tree/main/2025/Processing%20Community%20Survey) is open to use.
